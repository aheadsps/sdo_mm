import os
import io
import zipfile
from loguru import logger

from django.conf import settings
from django.core.files.base import ContentFile

from lessons.scorm.exceptions import SCORMExtractError
from lessons.scorm.utils import is_dir
from lessons.models import SCORM


class CoreSCORM:
    """
    Ядро работы конструктора SCORM
    """
    # def __init__(self, file: os.PathLike | io.IOBase[bytes]):
    #     self.file = file

    def extract_package(self, package_file: os.PathLike | io.IOBase[bytes]):
        """
        Открытие ZIP файла по получение ``imsmanifest.xml``

        Args:
            package_file (_type_): ZIP архив в представлении IO
        """
        logger.debug(f'get file zip {package_file}')
        with zipfile.ZipFile(package_file, "r") as scorm_zipfile:
            zipinfos = scorm_zipfile.infolist()
            logger.debug(f'get zipinfos {zipinfos}')
            root_path = self._get_root_path(
                zip_infos=zipinfos
            )
            logger.debug(f'root_path: {root_path}')
            self._save_extract_file(
                zip_file=scorm_zipfile,
                zip_infos=zipinfos,
                root_path=root_path,
            )

    def _get_root_path(self, zip_infos: zipfile.ZipInfo) -> str:
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

    def _save_extract_file(self,
                           zip_file: zipfile.ZipFile,
                           zip_infos: zipfile.ZipInfo,
                           root_path: str,
                           ) -> None:
        """
        Сохранение извлеченного файла
        """
        for zipinfo in zip_infos:
            if zipinfo.filename.startswith(root_path):
                if not is_dir(zipinfo):
                    logger.debug(f'zipinfo is {zipinfo}')
                    SCORM._default_manager.create(
                        name=zipinfo.filename,
                        file=ContentFile(zip_file.read(zipinfo.filename),),
                        )
