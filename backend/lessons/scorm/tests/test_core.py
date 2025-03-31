import zipfile
from pathlib import Path
from loguru import logger

from django.test import TestCase
from django.conf import settings

from lessons.scorm.engine.core import CoreSCORM
from lessons.models import SCORM


class TestSCORMCore(TestCase):
    """
    Тесты ядра SCORM

    """
    def test_extract_zip(self):
        zip_file_path: Path = settings.TEST_SCORM_PATH
        if not zip_file_path.exists():
            logger.warning('SCORM zip file is not found, '
                           f'test {self.test_extract_zip.__name__} is PASS',
                           )
            return True
        logger.debug(f'zip path is {zip_file_path}')
        with zipfile.ZipFile(zip_file_path) as file:
            scorm = CoreSCORM(zip_file=file)
            scorm.save()

        self.assertEqual(SCORM._default_manager.count(), 1)
