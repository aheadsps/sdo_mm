import os
import zipfile

import xml.etree.ElementTree as ET

from loguru import logger

from django.core.files.base import ContentFile

from lessons.scorm.engine.utils import is_dir
from lessons.models import SCORM, SCORMFile
from lessons.scorm.engine.utils import sanitize_input
from lessons.scorm.engine.exceptions import SCORMExtractError
from .base import BaseCoreSCORM
from .datasets import DataSetCore


class CoreSCORM(BaseCoreSCORM):
    """
    Ядро работы конструктора SCORM

    `Внутренее устроиство:`
    - Получение структуры курса
    - Сохраниние исходников в систему

    `Пример использования:`

    ```python
    with zipfile.ZipFile(zip_file_path) as file:
            scorm = CoreSCORM(zip_file=file)

    scorm.resources['file']
    scorm.save()
    ```
    """

    def __init__(self,
                 zip_file: zipfile.ZipFile,
                 ):
        super().__init__(zip_file)
        self._structures: list[tuple[str, str], str] | None = None

    @property
    def structures(self):
        if not self._structures:
            self._structures = self._get_structures()
        return self._structures

    def _get_items(self,
                   organization: DataSetCore,
                   ) -> list[DataSetCore] | list[None]:
        items = organization['item']
        return items

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

    def _get_resource_depends_on_identifier(self,
                                            identifier: str | None,
                                            root: ET.Element,
                                            ) -> list[DataSetCore]:
        if not identifier:
            resource_link = "#"
        else:
            resource = root.find(
                f'{self.prefix}resources/{self.prefix}resource[@identifier="{identifier}"]',
            )
            resource_link = resource.get("href")
        logger.debug(f'resource lisk is {resource_link}')
        return resource_link

    def _get_item_title(self,
                        organization: DataSetCore,
                        ) -> str:
        title = organization['title'][0].element.text
        sanitize_text = sanitize_input(title)
        logger.debug(f'text title is {sanitize_text}')
        return sanitize_text

    def _get_structures(self):
        structure_list = []
        root = self._manifest.getroot()
        for organization in self.organizations:
            structure_list.append(self._process_stucture_data(
                organization=organization,
                root=root,
            ))
        return structure_list

    def _process_stucture_data(self,
                               organization: DataSetCore,
                               root: ET.Element,
                               ) -> list[tuple[str, str], (list[tuple[str, str]] | None)]:
        sub_titles = []
        sub_items = self._get_items(
            organization=organization
        )
        title = self._get_item_title(
            organization=organization,
        )
        identifier = organization.element.get('identifierref')
        resource_link = self._get_resource_depends_on_identifier(
            identifier=identifier,
            root=root,
        )
        if not sub_items:
            logger.debug(f'add to structure list item - {title, resource_link}')
            return [(title, resource_link)]
        else:
            for item in sub_items:
                if "isvisible" in item.element.attrib and item.element.attrib["isvisible"] == "true":
                    sub_titles.extend(self._process_stucture_data(
                        organization=item,
                        root=root,
                    ))
            return [(title, resource_link), sub_titles]

    def save(self) -> SCORM:
        """
        Сохранение курса в систему
        """
        root_path = self._get_root_path(
            zip_infos=self._infos,
        )
        title = self._get_item_title(self.organizations[0])
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
