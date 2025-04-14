import os
from typing import IO, ClassVar, TypeVar

from zipfile import ZipFile, ZipExtFile

from lessons.scorm.engine.core import BaseCoreSCORM, CoreSCORM
from lessons.scorm.engine.parsers import CONSTRUCTOR_ADAPTER


T = TypeVar('T')


class SCORMLoader:
    """
    Основная оболочка SCORM
    """

    _core: ClassVar[BaseCoreSCORM] = CoreSCORM

    def __init__(self,
                 zip_archive: IO[bytes],
                 ) -> None:
        self._zip_archive = zip_archive
        self.zip_file = ZipFile(zip_archive)
        self.scorm_core = self._core(self.zip_file)

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
        self.zip_file.close()

    def save(self, instance: T | None = None, data: dict | None = None) -> T:
        """
        Распаковка и сохранение zip архива
        """
        if not data:
            data = dict()
        else:
            data = dict(**data)
        scorm = self.core.save(instance, data)
        self.zip_file.close()
        return scorm

    def delete(self) -> None:
        """
        Удаление scorm
        """
        self.core.delete()
