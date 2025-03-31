import os
from typing import IO
import zipfile
import xml.etree.ElementTree as ET
from loguru import logger

from django.conf import settings
from django.core.files.base import ContentFile

from lessons.scorm.engine.exceptions import SCORMExtractError
from lessons.scorm.engine.utils import is_dir
from lessons.models import SCORM, SCORMFile


class CoreSCORM:
    """
    Ядро работы конструктора SCORM
    """
    def __init__(self,
                 zip_file: zipfile.ZipFile,
                 ):
        self._file: zipfile.ZipFile = zip_file
        self._infos = zip_file.infolist()
        self._manifest: ET.ElementTree | None = None
        self._manifest_file: IO[bytes] | None = None
        self._meta: ET.Element | None = None
        self._organizations: ET.Element | None = None
        self._resources: list[ET.Element] | None = None
        with self as manifest:
            namespace = self._get_namespace(manifest)
            self.prefix = "{" + namespace + "}" if namespace else ""
            self.tree = self._get_manifest_tree(manifest_file=manifest)
            self._get_all_data(
                prefix=self.prefix,
                manifest_tree=self.tree,
            )

    @property
    def manifest(self):
        return self._manifest

    @property
    def meta(self):
        return self._meta

    @property
    def organizations(self):
        return self._organizations

    @property
    def resources(self):
        return self._resources

    def __getitem__(self, index: str):
        ...

    def _get_manifest_tree(self, manifest_file: IO[bytes]) -> ET.ElementTree:
        logger.debug(f'manifest_file is {manifest_file}')
        manifest_file.seek(0)
        tree = ET.parse(manifest_file)
        self._manifest = tree
        return tree

    def __enter__(self):
        manifest_info = self._file.getinfo(settings.SCORM_MANIFEST_NAME)
        logger.debug(f'seaching manifest {manifest_info}')
        if not manifest_info:
            raise SCORMExtractError(
                "Не возможно найти imsmanifest.xml в zip архиве"
            )
        self._manifest_file = self._file.open(manifest_info)
        return self._manifest_file

    def __exit__(self, type, value, traceback):
        self._manifest_file.close()

    def _get_all_data(self,
                      prefix: str,
                      manifest_tree: ET.ElementTree,
                      ):
        root = manifest_tree.getroot()
        self._resources = root.find(
            f"{prefix}resources/{prefix}resource[@href]"
        )
        self._meta = root.find(
            f"{prefix}metadata/{prefix}schemaversion"
        )
        self._organizations = self._get_organizations(
            root=root,
            prefix=prefix,
        )
        logger.debug(f'meta is {self.meta}')
        logger.debug(f'resources is {self.resources}')
        logger.debug(f'organizations is {self.organizations}')
        logger.debug(f'manifest is {self.manifest}')

    def _get_organizations(self,
                           root: ET.Element,
                           prefix: str,
                           ) -> list[ET.Element]:
        organizations = root.findall(
            f"{prefix}organizations/{prefix}organization"
        )
        return organizations

    def _get_root_path(self,
                       zip_infos: list[zipfile.ZipInfo],
                       ) -> str:
        """
        Получение адресса корня
        """
        root_depth = -1
        root_path = None
        for zipinfo in zip_infos:
            if os.path.basename(zipinfo.filename) == settings.SCORM_MANIFEST_NAME:
                depth = len(os.path.split(zipinfo.filename))
                if depth < root_depth or root_depth < 0:
                    root_path = os.path.dirname(zipinfo.filename)
                    root_depth = depth

        if root_path is None:
            raise SCORMExtractError(
                "Не возможно найти imsmanifest.xml в zip архиве"
            )

        return root_path

    def _get_name_course(self, prefix: str) -> str:
        item_title = self._organizations[0].find(f"{prefix}title").text
        logger.debug(f'title is {item_title}')
        return item_title

    def _get_namespace(self, manifest_file: IO[bytes]) -> str:
        namespace = ""
        for _, node in ET.iterparse(manifest_file, events=["start-ns"]):
            if node[0] == "":
                namespace = node[1]
                break
        logger.debug(f'namespace is {namespace}')
        return namespace

    def save(self) -> SCORM:
        """
        Сохранение курса в систему
        """
        root_path = self._get_root_path(
            zip_infos=self._infos,
        )
        title = self._get_name_course(prefix=self.prefix)
        scorm_lesson = SCORM._default_manager.create(
            name=title,
            )
        list_files = []
        for zipinfo in self._infos:
            if zipinfo.filename.startswith(root_path):
                if not is_dir(zipinfo):
                    list_files.append(SCORMFile(
                        scorm=scorm_lesson,
                        file=ContentFile(self._file.read(zipinfo.filename),
                                         zipinfo.filename,),
                        ))
        SCORMFile._default_manager.bulk_create(list_files)
        return scorm_lesson
