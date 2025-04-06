import os
from typing import IO, ClassVar

from zipfile import ZipFile, ZipExtFile

from lessons.scorm.engine.core import BaseCoreSCORM, CoreSCORM
from lessons.scorm.engine.parsers import CONSTRUCTOR_ADAPTER
from .s_types import ParserCallable


class SCORMLoader:
    """
    Основная оболочка SCORM
    """

    _core: ClassVar[BaseCoreSCORM] = CoreSCORM

    def __init__(self,
                 zip_archive: IO[bytes],
                 ) -> None:
        self._zip_archive = zip_archive
        with ZipFile(zip_archive) as zip_file:
            self.scorm_core = self._core(zip_file)

    @property
    def core(self):
        return self.scorm_core

    def open(self, zip_path: os.PathLike) -> ZipExtFile:
        with ZipFile(self._zip_archive) as zip_file:
            self.file = zip_file.open(str(zip_path))
            return self.file

    def close(self):
        if self.file:
            self.file.close()

    def entrypoint(self) -> None:
        class_adapter = CONSTRUCTOR_ADAPTER.get('default')
        class_adapter(self).parse()

    def save(self):
        self.core.save()
