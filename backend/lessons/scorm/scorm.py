from typing import IO, ClassVar
from pathlib import Path

from zipfile import ZipFile

from lessons.scorm.engine.core import BaseSCORMCore, CoreSCORM
from .s_types import ParserCallable


class SCORMLoader:
    """
    Основная оболочка SCORM
    """

    core: ClassVar[BaseSCORMCore] = CoreSCORM

    def __init__(self,
                 zip_archive: IO[bytes],
                 ) -> None:
        self._zip_archive = zip_archive
        with ZipFile(zip_archive) as zip_file:
            self.scorm_core = self.core(zip_file)

    def __enter__(self, zip_path: str) -> IO[bytes]:
        path = Path(str(zip_path))
        with ZipFile(self._zip_archive) as zip_file:
            self.file = zip_file.open(str(path))

    def __exit__(self, type, value, traceback):
        self.file.close()

    def entrypoint(self, parser: ParserCallable) -> None:
        parser(self)
