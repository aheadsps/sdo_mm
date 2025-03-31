import os
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
        self._manifest: ET.ElementTree | None = None
        self._meta = None
        self._organizations = None
        self._resources = None

    @property
    def manifest(self):
        return self._manifest

    @property
    def meta(self):
        return self._meta

    @property
    def organizations(self):
        return self._organizations

    def _get_all_data(self,
                      prefix: str,
                      manifest_tree: ET.ElementTree,
                      ):
        root = manifest_tree.getroot()
        resource = root.find(
            f"{prefix}resources/{prefix}resource[@href]"
        )
        schemaversion = root.find(
            f"{prefix}metadata/{prefix}schemaversion"
        )
        self._organizations = self._get_organizations(
            root=root,
            prefix=prefix,
        )
        logger.debug(f'prefix is {prefix}')
        logger.debug(f'resource is {resource}')
        logger.debug(f'schema is {schemaversion}')
        logger.debug(f'resourses is {resource.get("href")}')

    def _get_organizations(self,
                           root: ET.Element,
                           prefix: str,
                           ) -> list[ET.Element]:
        organizations = root.findall(
            f"{prefix}organizations/{prefix}organization"
        )
        return organizations

    def get_resources(self, manifest):
        ...

    def _extract_manifest(self,
                          file: zipfile.ZipFile,
                          manifests_info: zipfile.ZipInfo,
                          ):
        manifest = file.open(manifests_info)
        self._manifest = ET.parse(manifest)
        manifest.seek(0)
        return manifest

    def _get_root_path(self,
                       zip_infos: list[zipfile.ZipInfo],
                       zip_file: zipfile.ZipFile,
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
                manifest = self._extract_manifest(
                    file=zip_file,
                    manifests_info=zipinfo,
                )

        if root_path is None:
            raise SCORMExtractError(
                "Не возможно найти imsmanifest.xml в zip архиве"
            )

        return root_path, manifest

    def _get_name_course(self, prefix: str) -> str:
        item_title = self._organizations[0].find(f"{prefix}title").text
        return item_title

    def save(self) -> None:
        """
        Сохранение извлеченного файла
        """
        zip_infos = self._file.infolist()
        root_path, manifest_file = self._get_root_path(
            zip_infos=self._file.infolist(),
            zip_file=self._file,
        )
        namespace = ''
        for _, node in ET.iterparse(manifest_file, events=["start-ns"]):
            if node[0] == "":
                namespace = node[1]
                break
        manifest_file.close()
        prefix = "{" + namespace + "}" if namespace else ""
        self._get_all_data(prefix=prefix, manifest_tree=self.manifest)
        title = self._get_name_course(prefix=prefix)
        scorm_lesson = SCORM._default_manager.create(
            name=title,
            )
        list_files = []
        for zipinfo in zip_infos:
            if zipinfo.filename.startswith(root_path):
                if not is_dir(zipinfo):
                    logger.debug(f'zipinfo is {zipinfo}')
                    list_files.append(SCORMFile(
                        scorm=scorm_lesson,
                        file=ContentFile(self._file.read(zipinfo.filename),
                                         zipinfo.filename,),
                        ))
        SCORMFile._default_manager.bulk_create(list_files)
