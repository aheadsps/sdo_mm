from pathlib import Path

from django.conf import settings
from django.core.files import File
from rest_framework.test import APITestCase

from lessons.models import Question


class TestModels(APITestCase):
    """
    Тесты основных функций модели
    """

    def test_path_image_question(self):
        """
        Тест сохранения файлов по пути
        Будет двойной путь изза разположения файла в тестовой среде
        """
        image_path: Path = settings.TEST_IMAGE_PATH
        with image_path.open("rb") as image:
            question = Question._default_manager.create(
                text="some_question", image=File(image)
            )
        self.assertIn(
            "some_quest",
            question.image.path,
        )
