import os
import zipfile

import xml.etree.ElementTree as ET

from django.conf import settings
from loguru import logger

from .abc import AbstractCore
from typing import IO, ClassVar
from lessons.scorm.engine.exceptions import SCORMExtractError
from .datasets import DataSetCore


class BaseSCORMCore(AbstractCore):
    """
    Базовое ядро с базовыми функциями

    `Внутренее устроиство:`

    - Обработка полученного ZIP архива со SCORM
    - Получение корня SCORM
    - Нахождение файла структуры xml
    - Вывод префикса для работы DOMTree
    - Разбиение DOMTree на части и получение основных компонентов
    - Основные компоненты обворачиваются в обочку class::DataSetCore::
    - `DataSetCore` предоставляет удобный API для взаимодейсвия с конкретными
    элементами древа
    """

    root_name: ClassVar[str | None] = settings.SCORM_MANIFEST_NAME

    def __init__(self,
                 zip_file: zipfile.ZipFile,
                 ):
        self._file: zipfile.ZipFile = zip_file
        self._infos = zip_file.infolist()
        self._manifest_file: IO[bytes] | None = None
        self._meta: ET.Element | None = None
        self._organizations: list[ET.Element] | None = None
        self._resources: ET.Element | None = None
        with self as manifest:
            namespace = self._get_namespace(manifest)
            self.prefix = "{" + namespace + "}" if namespace else ""
            self._manifest = self._get_manifest_tree(manifest_file=manifest)
            self._get_all_data(
                prefix=self.prefix,
                manifest_tree=self._manifest,
            )

    def __enter__(self):
        manifest_info = self._file.getinfo(self.root_name)
        logger.debug(f'seaching manifest {manifest_info}')
        if not manifest_info:
            raise SCORMExtractError(
                f"Не возможно найти {self.root_name} в zip архиве"
            )
        self._manifest_file = self._file.open(manifest_info)
        return self._manifest_file

    def __exit__(self, type, value, traceback):
        self._manifest_file.close()

    @property
    def manifest(self):
        return self._manifest

    @property
    def meta(self):
        return DataSetCore(
            element=self._meta,
            prefix=self.prefix,
        )

    @property
    def organizations(self):
        organizations = [DataSetCore(
            element=organization,
            prefix=self.prefix,
        )
                          for organization
                          in self._organizations]
        return organizations

    @property
    def resources(self):
        return DataSetCore(
            element=self._resources,
            prefix=self.prefix,
        )

    def _get_manifest_tree(self, manifest_file: IO[bytes]) -> ET.ElementTree:
        logger.debug(f'manifest_file is {manifest_file}')
        manifest_file.seek(0)
        tree = ET.parse(manifest_file)
        return tree

    def _get_all_data(self,
                      prefix: str,
                      manifest_tree: ET.ElementTree,
                      ):
        root = manifest_tree.getroot()
        self._resources = root.find(
            f"{prefix}resources/{prefix}resource[@href]"
        )
        self._meta = root.find(
            f"{prefix}metadata"
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
            if os.path.basename(zipinfo.filename) == self.root_name:
                depth = len(os.path.split(zipinfo.filename))
                if depth < root_depth or root_depth < 0:
                    root_path = os.path.dirname(zipinfo.filename)
                    root_depth = depth

        if root_path is None:
            raise SCORMExtractError(
                f"Не возможно найти {self.root_name} в zip архиве"
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

    def save(self):
        return super().save()
