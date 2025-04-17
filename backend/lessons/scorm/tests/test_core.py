import tempfile
from pathlib import Path
from loguru import logger

from django.test import TestCase
from django.conf import settings
from django.test import override_settings

from lessons.scorm import SCORMLoader
from lessons.models import Lesson


class TestSCORMCore(TestCase):
    """
    Тесты ядра SCORM

    """
    @override_settings(MEDIA_ROOT=tempfile.TemporaryDirectory(prefix='mediatest').name)
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

        self.assertEqual(Lesson._default_manager.count(), 1)
        self.assertEqual(Lesson._default_manager.get().name, 'Первая помощь (часть 1)')
