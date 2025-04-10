from django.test import TestCase
from django.utils import timezone
from django.core.files import File
from backend.lessons.models import Course, SCORM
from backend.users.models import Profession, WorkExperience
from backend.lessons.utils import path_maker_course
from django.urls import reverse

class CourseModelTest(TestCase):
    def setUp(self):
        self.profession = Profession.objects.create(name="Test Profession")
        self.experience = WorkExperience.objects.create(name="Test Experience")
        self.scorm = SCORM.objects.create(name="Test SCORM", version="1.2")
        self.course = Course.objects.create(name="Test Course", decription="Test Course Description",
                                           beginer=True, profession=self.profession, scorm=self.scorm)
        self.course.experiences.add(self.experience)

    def test_course_creation(self):
        """Проверяем создание курса"""
        self.assertEqual(self.course.name, "Test Course")
        self.assertEqual(self.course.description, "Test Course Description")
        self.assertTrue(self.course.beginer)
        self.assertEqual(self.course.profession, self.profession)
        self.assertEqual(self.course.scorm, self.scorm)
        self.assertTrue(self.course.experiences.filter(pk=self.experience.pk).exists())

    def test_str_representation(self):
        """Тест строкового представления модели"""
        self.assertEqual(str(self.course), "Пример курса")

    def test_absolute_url(self):
        """Тест метода get_absolute_url"""
        expected_url = reverse('course-detail', kwargs={'pk': self.course.pk})
        self.assertEqual(self.course.get_absolute_url(), expected_url)