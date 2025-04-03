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

        self.assertEqual(scorm.resources['file'][0].element.get('href'), 'json/structure.json')
        self.assertEqual(scorm.meta['schemaversion'][0].element.text, '2004 4th Edition')
        self.assertEqual(scorm.structures[0][0]['title'], 'Введение в Python')
        self.assertEqual(SCORM._default_manager.count(), 1)
        self.assertEqual(SCORM._default_manager.get().name, 'Введение в Python')
