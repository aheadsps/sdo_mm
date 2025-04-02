from typing import Generic, TypeVar, IO, ClassVar
from pathlib import Path

from zipfile import ZipFile

from lessons.scorm.engine.parsers import BaseParser
from lessons.scorm.engine.core import BaseSCORMCore, CoreSCORM


P_co = TypeVar('P_co', covariant=True)


class SCORMLoader(Generic[P_co]):
    """
    Основная оболочка SCORM
    """

    core: ClassVar[BaseSCORMCore] = CoreSCORM

    def __init__(self,
                 zip_archive: IO[bytes],
                 parser: P_co,
                 ) -> None:
        self._zip_archive = zip_archive
        self._parser = parser
        with ZipFile(zip_archive) as zip_file:
            self.scorm_core = self.core(zip_file)

    def __enter__(self, zip_path: str) -> IO[bytes]:
        path = Path(str(zip_path))
        with ZipFile(self._zip_archive) as zip_file:
            self.file = zip_file.open(str(path))

    def __exit__(self, type, value, traceback):
        self.file.close()

    @property
    def parser(self) -> P_co:
        return self._parser

    def entrypoint(self, parser: 'SCORMLoader'[BaseParser]) -> None:
        parser(self)
