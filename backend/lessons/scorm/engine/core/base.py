import zipfile

from django.conf import settings
from loguru import logger

from .abc import AbstractCore
from typing import IO, ClassVar
from lessons.scorm.engine.exceptions import SCORMExtractError


class BaseSCORMCore(AbstractCore):
    """
    Базовое ядро с базовыми функциями
    """

    root_name: ClassVar[str | None] = settings.SCORM_MANIFEST_NAME

    def __init__(self,
                 zip_file: zipfile.ZipFile,
                 ):
        self._file: zipfile.ZipFile = zip_file
        self._infos = zip_file.infolist()
        self._manifest_file: IO[bytes] | None = None

    def __enter__(self):
        manifest_info = self._file.getinfo(self.root_name)
        logger.debug(f'seaching manifest {manifest_info}')
        if not manifest_info:
            raise SCORMExtractError(
                "Не возможно найти imsmanifest.xml в zip архиве"
            )
        self._manifest_file = self._file.open(manifest_info)
        return self._manifest_file

    def __exit__(self, type, value, traceback):
        self._manifest_file.close()

    def save(self):
        return super().save()
