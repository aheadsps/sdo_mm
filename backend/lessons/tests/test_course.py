
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from lessons.models import Course
from users.models import Profession, WorkExperience
from lessons.models import SCORM


class CourseModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Создаем тестовые данные
        cls.profession = Profession.objects.create(name="Тестовая профессия")
        cls.scorm = SCORM.objects.create(title="Тестовый SCORM")
        cls.experience = WorkExperience.objects.create(years=1)

        # Создаем тестовое изображение
        cls.test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00',
            content_type='image/jpeg'
        )

        # Основной тестовый курс
        cls.course = Course.objects.create(
            name="Тестовый курс",
            description="Тестовое описание",
            image=cls.test_image,
            profession=cls.profession,
            scorm=cls.scorm
        )
        cls.course.experiences.add(cls.experience)

    def test_model_fields(self):
        """Проверка корректности заполнения полей модели"""
        course = self.course

        self.assertEqual(course.name, "Тестовый курс")
        self.assertEqual(course.description, "Тестовое описание")
        self.assertTrue(course.image.name.startswith('courses/'))
        self.assertEqual(course.profession, self.profession)
        self.assertEqual(course.scorm, self.scorm)
        self.assertIn(self.experience, course.experiences.all())

    def test_auto_datetime_fields(self):
        """Проверка автоматических полей даты/времени"""
        now = timezone.now()

        self.assertLessEqual(self.course.create_date, now)
        self.assertLessEqual(self.course.update_date, now)

    def test_beginer_default_value(self):
        """Проверка значения по умолчанию для beginer"""
        new_course = Course.objects.create(name="Новый курс")
        self.assertFalse(new_course.beginer)

    def test_update_date_auto_update(self):
        """Проверка автообновления update_date"""
        original_date = self.course.update_date
        self.course.name = "Обновленное имя"
        self.course.save()
        self.assertGreater(self.course.update_date, original_date)

    def test_foreign_key_relations(self):
        """Проверка отношений ForeignKey"""
        # Проверка SET_NULL для profession
        self.profession.delete()
        self.course.refresh_from_db()
        self.assertIsNone(self.course.profession)

        # Проверка SET_NULL для scorm
        self.scorm.delete()
        self.course.refresh_from_db()
        self.assertIsNone(self.course.scorm)

    def test_str_representation(self):
        """Проверка строкового представления"""
        self.assertEqual(str(self.course), "Тестовый курс")

    def test_verbose_names(self):
        """Проверка verbose names"""
        self.assertEqual(Course._meta.verbose_name, "Course")
        self.assertEqual(Course._meta.verbose_name_plural, "Courses")

    def test_field_verbose_names(self):
        """Проверка verbose names отдельных полей"""
        field_verboses = {
            'name': 'Название',
            'description': 'Описание',
            'beginer': 'Начинающий',
            'create_date': 'Дата создания',
            'update_date': 'Дата обновления',
            'image': 'Превью',
            'profession': 'профессия',
            'scorm': 'SCORM',
            'experiences': 'Стаж',
        }

        for field, expected_value in field_verboses.items():
            with self.subTest(field=field):
                verbose_name = self.course._meta.get_field(field).verbose_name
                self.assertEqual(verbose_name, expected_value)

    def test_help_texts(self):
        """Проверка help texts"""
        help_texts = {
            'name': 'Название курса',
            'description': 'Описание курса',
            'beginer': 'Курс для начинающих',
            'create_date': 'Дата создания курса',
            'update_date': 'Дата обновления курса',
            'experiences': 'На какие стажи расчитан курс',
        }

        for field, expected_value in help_texts.items():
            with self.subTest(field=field):
                help_text = self.course._meta.get_field(field).help_text
                self.assertEqual(help_text, expected_value)

    def test_ordering(self):
        """Проверка сортировки по умолчанию (если есть)"""
        # Если в Meta есть ordering, добавить соответствующие проверки
        pass

    def test_m2m_relation(self):
        """Проверка отношения ManyToMany"""
        new_experience = WorkExperience.objects.create(years=3)
        self.course.experiences.add(new_experience)
        self.assertEqual(self.course.experiences.count(), 2)

        self.course.experiences.remove(new_experience)
        self.assertEqual(self.course.experiences.count(), 1)

    def test_image_upload_path(self):
        """Проверка пути загрузки изображения"""
        self.assertTrue(
            self.course.image.name.startswith('courses/'),
            msg=f"Неверный путь загрузки изображения: {self.course.image.name}"
        )
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