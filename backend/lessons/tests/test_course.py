from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.translation import gettext_lazy as _
from datetime import datetime

from lessons.models import Course, SCORM
from users.models import Profession, WorkExperience


class CourseModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Создаем тестовые данные
        cls.profession = Profession.objects.create(verbose_name="Name Profession")
        cls.experience = WorkExperience.objects.create(years=2)
        cls.scorm = SCORM.objects.create(title="Test SCORM")

        cls.course = Course.objects.create(
            verbose_name="Name Profession",
            description="Introduction",
            beginer=True,
            profession=cls.profession,
            scorm=cls.scorm
        )
        cls.course.experiences.add(cls.experience)

    def test_field_labels(self):
        """Проверка verbose_name полей"""
        self.assertEqual(Course._meta.get_field('name').verbose_name, _("Название"))
        self.assertEqual(Course._meta.get_field('description').verbose_name, _("Описание"))
        self.assertEqual(Course._meta.get_field('beginer').verbose_name, _("Начинающий"))

    def test_field_help_texts(self):
        """Проверка help_text полей"""
        self.assertEqual(Course._meta.get_field('name').help_text, "Название курса")
        self.assertEqual(Course._meta.get_field('description').help_text, "Описание курса")
        self.assertEqual(Course._meta.get_field('beginer').help_text, "Курс для начинающих")

    def test_auto_dates(self):
        """Проверка автоматического заполнения дат"""
        self.assertIsNotNone(self.course.create_date)
        self.assertIsNotNone(self.course.update_date)

        # Проверка обновления update_date
        old_update = self.course.update_date
        self.course.name = "Updated Name"
        self.course.save()
        self.assertGreater(self.course.update_date, old_update)

    def test_relations(self):
        """Проверка связей модели"""
        self.assertEqual(self.course.profession, self.profession)
        self.assertEqual(self.course.scorm, self.scorm)
        self.assertEqual(self.course.experiences.count(), 1)
        self.assertEqual(self.course.experiences.first(), self.experience)

    def test_str_method(self):
        """Проверка строкового представления"""
        self.assertEqual(str(self.course), "Basics")

    def test_image_upload(self):
        """Проверка загрузки изображения"""
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'simple image content',
            content_type='image/jpeg'
        )
        self.course.image = test_image
        self.course.save()
        self.assertTrue(self.course.image.name.startswith('courses/'))
        self.assertIn('test_image', self.course.image.name)

    def test_meta_options(self):
        """Проверка мета-опций"""
        self.assertEqual(Course._meta.verbose_name, _("Course"))
        self.assertEqual(Course._meta.verbose_name_plural, _("Courses"))


class CourseAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.profession = Profession.objects.create(verbose_name="Name Profession")
        cls.experience = WorkExperience.objects.create(years=1)
        cls.scorm = SCORM.objects.create(title="SCORM")

        cls.course_data = {
            "name": "specialist",
            "description": "specialist basics",
            "beginer": True,
            "profession": cls.profession.id,
            "experiences": [cls.experience.id],
            "scorm": cls.scorm.id
        }

    def test_create_course(self):
        """Тест создания курса через API"""
        url = reverse('course-list')
        response = self.client.post(url, self.course_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 1)

        course = Course.objects.first()
        self.assertEqual(course.name, self.course_data['name'])
        self.assertEqual(course.profession.id, self.course_data['profession'])
        self.assertEqual(course.experiences.count(), 1)

    def test_retrieve_course(self):
        """Тест получения данных курса"""
        course = Course.objects.create(
            name="Existing Course",
            description="Test description",
            profession=self.profession
        )
        course.experiences.add(self.experience)

        url = reverse('course-detail', args=[course.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], course.name)
        self.assertEqual(response.data['profession'], course.profession.id)
        self.assertEqual(len(response.data['experiences']), 1)

    def test_update_course(self):
        """Тест обновления курса"""
        course = Course.objects.create(
            name="Old Name",
            description="Old Description",
            profession=self.profession
        )

        updated_data = {
            "name": "Updated Name",
            "description": "Updated Description",
            "beginer": False
        }

        url = reverse('course-detail', args=[course.id])
        response = self.client.patch(url, updated_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        course.refresh_from_db()
        self.assertEqual(course.name, updated_data['name'])
        self.assertEqual(course.beginer, updated_data['beginer'])

    def test_delete_course(self):
        """Тест удаления курса"""
        course = Course.objects.create(
            name="Course to delete",
            description="Will be deleted",
            profession=self.profession
        )

        url = reverse('course-detail', args=[course.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 0)


        # class CourseModelTest(TestCase):
    # def setUp(self):
    #     self.profession = Profession.objects.create(name="Test Profession")
    #     self.experience = WorkExperience.objects.create(name="Test Experience")
    #     self.scorm = SCORM.objects.create(name="Test SCORM", version="1.2")
    #     self.course = Course.objects.create(name="Test Course", decription="Test Course Description",
    #                                        beginer=True, profession=self.profession, scorm=self.scorm)
    #     self.course.experiences.add(self.experience)
    #
    # def test_course_creation(self):
    #     """Проверяем создание курса"""
    #     self.assertEqual(self.course.name, "Test Course")
    #     self.assertEqual(self.course.description, "Test Course Description")
    #     self.assertTrue(self.course.beginer)
    #     self.assertEqual(self.course.profession, self.profession)
    #     self.assertEqual(self.course.scorm, self.scorm)
    #     self.assertTrue(self.course.experiences.filter(pk=self.experience.pk).exists())
    #
    # def test_str_representation(self):
    #     """Тест строкового представления модели"""
    #     self.assertEqual(str(self.course), "Пример курса")
    #
    # def test_absolute_url(self):
    #     """Тест метода get_absolute_url"""
    #     expected_url = reverse('course-detail', kwargs={'pk': self.course.pk})
    #     self.assertEqual(self.course.get_absolute_url(), expected_url)