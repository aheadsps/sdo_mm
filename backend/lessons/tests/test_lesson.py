from django.test import TestCase
from django.core.exceptions import ValidationError

from lessons.models import Lesson, Course

class LessonModelTest(TestCase):

    def setUp(self):
        self.course = Course.objects.create(name="Test Course")
        self.lesson = Lesson.objects.create(
            name="Test Lesson",
            serial=1,
            course=self.course
        )

    def test_create_lesson(self):
        """Тест создания урока"""
        lesson = Lesson.objects.create(
            name="Новый урок",
            serial=2,
            course=self.course
        )
        self.assertEqual(lesson.name, "Новый урок")
        self.assertEqual(lesson.serial, 2)
        self.assertEqual(lesson.course, self.course)

    def test_name_max_length(self):
        """Тест проверки максимальной длины названия"""
        with self.assertRaises(ValidationError):
            Lesson.objects.create(
                name="a" * 256,
                serial=1,
                course=self.course
            )