from django.test import TestCase

from .models import Lesson, TestBlock


class TestBlockModelTests(TestCase):
    def setUp(self):
        # Создание тестовых данных
        self.lesson = Lesson.objects.create(title="Test Lesson")
        self.test_block = TestBlock.objects.create(
            description="Test Description", lessons=self.lesson
        )

    def test_description_value(self):
        # Проверка описания
        self.assertEqual(self.test_block.description, "Test Description")

    def test_lessons_relation(self):
        # Проверка связи с уроком
        self.assertEqual(self.test_block.lessons, self.lesson)

    def test_verbose_names(self):
        # Проверка названий модели
        self.assertEqual(str(TestBlock._meta.verbose_name), "тестовый блок")
        self.assertEqual(str(TestBlock._meta.verbose_name_plural), "тестовые блоки")

    def test_ordering(self):
        # Проверка порядка сортировки
        self.assertEqual(TestBlock._meta.ordering, ["lessons"])
