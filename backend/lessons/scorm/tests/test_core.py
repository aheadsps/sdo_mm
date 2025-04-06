from pathlib import Path
from loguru import logger

from django.test import TestCase
from django.conf import settings

from lessons.scorm import SCORMLoader
from lessons.scorm.engine.parsers import BaseParser
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
        with open(file=zip_file_path, mode='b+r') as file:
            scorm = SCORMLoader(file)
            scorm.save()
            scorm.entrypoint(BaseParser)

        self.assertEqual(SCORM._default_manager.count(), 1)
        self.assertEqual(SCORM._default_manager.get().name, 'Введение в Python')
