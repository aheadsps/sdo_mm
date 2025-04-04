from collections.abc import Generator

from loguru import logger
from zipfile import ZipExtFile
from pathlib import Path
import xml.etree.ElementTree as ET

from django.conf import settings

from lessons.scorm.engine.parsers import AbstractParser
from lessons.scorm.s_types import WrapperCallable


class BaseParser(AbstractParser):
    """
    Базовый парсер
    """

    CONSTRUCTOR_ADAPTER = settings.CONSTRUCTOR_ADAPTER

    def __init__(self,
                 wrapper: WrapperCallable,
                 ):
        self._wrapper = wrapper
        # self._path = self.CONSTRUCTOR_ADAPTER.get(
        #     self._wrapper.core.constructor_type,
        # )

    @property
    def wrapper(self):
        return self._wrapper

    def _search_content(self, path: str) -> ZipExtFile:
        path = Path(path)
        logger.debug(f'path is {path}')
        file = self.wrapper.open(path)
        return file

    def _recursive_parse(self,
                         course: list[dict[str, str | list[ET.Element]] |
                                      list[dict[str, str | list[ET.Element]]]],
                         serial_lessons: int = 0,
                         ) -> Generator[tuple[int, str, ZipExtFile]]:
        for lesson in course:
            try:
                resource = lesson.get('resource')
                if resource == '#':
                    serial_lessons += 1
                    continue
                for file in lesson['files']:
                    file_path = file.get('href')
                    if file_path:
                        yield (self._search_content(file_path))
            except AttributeError:
                self._recursive_parse(lesson, serial_lessons)

    def parse(self):
        pass
