import datetime
import tempfile

from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django_celery_beat.models import PeriodicTask
from django.urls import reverse
from django.test import override_settings
from django.conf import settings
from lessons import models as lessons_models
from lessons.utils import UTCTimeCast
from users import models as users_models


class TestEndpoints(APITestCase):
    """
    Тесты Эндпоинтов
    """

    def setUp(self):
        self.profession = users_models.Profession._default_manager.create(
            en_name="prof",
            ru_name="проф",
        )
        self.experience = users_models.WorkExperience._default_manager.create(
            years=0,
        )
        date_commencement = datetime.date(
            year=2023,
            month=1,
            day=1,
        )
        self.user = get_user_model()._default_manager.create(
            email="user@gmail.com",
            profession=self.profession,
            password="password",
            date_commencement=date_commencement,
            is_staff=True,
        )
        self.user_1 = get_user_model()._default_manager.create(
            email="user1@gmail.com",
            profession=self.profession,
            password="password",
            date_commencement=date_commencement,
        )
        group_profession = users_models.ProfessionGroup._default_manager.create(
            profession=self.profession,
        )
        group_profession.students.add(self.user)
        group_profession.save()
        self.course = lessons_models.Course._default_manager.create(
            teacher=self.user,
            name="course",
            description="some",
            interval=datetime.timedelta(days=7),
            profession=self.profession,
        )
        self.course_1 = lessons_models.Course._default_manager.create(
            teacher=self.user,
            name="course_1",
            description="some_1",
            interval=datetime.timedelta(days=7),
            profession=self.profession,
        )
        self.course_b = lessons_models.Course._default_manager.create(
            teacher=self.user,
            name="course_b",
            description="some_b",
            beginner=True,
            profession=self.profession,
        )
        self.lesson = lessons_models.Lesson._default_manager.create(
            teacher=self.user,
            name='lesson',
            course=self.course,
        )
        self.lesson_1 = lessons_models.Lesson._default_manager.create(
            teacher=self.user,
            name='lesson_1',
            course=self.course_1,
        )
        self.lesson_b = lessons_models.Lesson._default_manager.create(
            teacher=self.user,
            name='lesson_b',
            course=self.course_b,
        )
        self.course.experiences.add(
            self.experience,
        )
        self.course_1.experiences.add(
            self.experience,
        )
        self.course_b.experiences.add(
            self.experience,
        )
        self.test_block = lessons_models.TestBlock._default_manager.create(
            lesson=self.lesson
        )
        self.test_block_1 = lessons_models.TestBlock._default_manager.create(
            lesson=self.lesson_1
        )
        self.test_block_b = lessons_models.TestBlock._default_manager.create(
            lesson=self.lesson_b
        )
        self.course.save()
        self.course_1.save()
        self.course_b.save()
        self.event = lessons_models.Event._default_manager.create(
            course=self.course,
            start_date=datetime.datetime(year=2026, month=1, day=1),
            end_date=datetime.datetime(year=2027, month=1, day=1),
        )
        self.curr_time_event = str(
            UTCTimeCast(
                input_time=self.course.create_date,
                UTC=3,
            ).get_UTC_set_time()
        ).replace(" ", "T")
        self.client.force_authenticate(self.user)

    def register_user(self):
        """
        Тест регистрации пользователя на курс
        """
        self.client.logout()
        self.client.force_authenticate(self.user_1)
        path = '/api/v1/covers'
        data = dict(event=self.event)
        response = self.client.post(path=path, data=data, content_type='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(lessons_models.EventCovered._default_manager.count(), 1)

    def register_user_twise_fail(self):
        """
        Тест регистрации пользователя на курс дважды
        """
        self.client.logout()
        self.client.force_authenticate(self.user_1)
        path = '/api/v1/covers'
        data = dict(event=self.event)
        response_1 = self.client.post(path=path, data=data, content_type='json')
        response_2 = self.client.post(path=path, data=data, content_type='json')
        self.assertEqual(response_1.status_code, 201)
        self.assertEqual(response_2.status_code, 422)
        self.assertEqual(lessons_models.EventCovered._default_manager.count(), 1)

    def test_get_event(self):
        """
        Тест получение Эвента по ID
        """
        url = reverse(
            "lessons:event-detail",
            kwargs={"event_id": self.event.pk},
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_event_duplicate(self):
        """
        Тест создания курса дубликата
        """
        url = "/api/v1/events"
        data = dict(
            course=self.course.pk,
            start_date=datetime.datetime(
                year=2025,
                month=1,
                day=1,
                hour=23,
                minute=1,
                second=1,
            ),
        )
        response = self.client.post(
            path=url,
            data=data,
            format="json",
        )
        self.assertEqual(response.status_code, 422)

    def test_create_event_start_date_fail(self):
        """
        Тест создания эвента
        """
        url = "/api/v1/events"
        data_1 = dict(
            course=self.course_1.pk,
            start_date=datetime.datetime(
                year=2023,
                month=1,
                day=1,
                hour=23,
                minute=1,
                second=1,
            ),
        )
        response_1 = self.client.post(
            path=url,
            data=data_1,
            format="json",
        )
        self.assertEqual(response_1.status_code, 422)

    def test_create_event(self):
        """
        Тест создания эвента
        """
        url = "/api/v1/events"
        data = dict(
            course=self.course_1.pk,
            start_date=datetime.datetime(
                year=2026,
                month=1,
                day=1,
                hour=23,
                minute=1,
                second=1,
            ),
        )
        response = self.client.post(
            path=url,
            data=data,
            format="json",
        )
        course = lessons_models.Course._default_manager.get(pk=self.course_1.pk)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(course.status, 'run')
        self.assertFalse(course.lessons.first().started)
        self.assertEqual(str(course.lessons.first().start_date), '2026-01-01 20:01:01+00:00')
        self.assertEqual(
            response.json(),
            {
                "id": lessons_models.Event._default_manager.get(course=self.course_1).pk,
                "course": self.course_1.pk,
                "start_date": "2026-01-01T23:01:01+03:00",
                "end_date": "2026-01-08T23:01:01+03:00",
                "status": "expected",
            },
        )

    def test_create_beginner_event(self):
        url = '/api/v1/events'
        data = dict(
            course=self.course_b.pk,
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)

    def test_update_event(self):
        """
        Тест обновления эвента
        """
        url = f"/api/v1/events/{self.event.pk}"
        data = dict(
            start_date=datetime.datetime(
                year=2028,
                month=1,
                day=1,
            ),
            end_date=datetime.datetime(
                year=2029,
                month=1,
                day=1,
            ),
            favorite=True,
        )
        response = self.client.patch(
            path=url,
            data=data,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_get_list_current_events(self):
        """
        Тест получения актуальных эвентов на пользователе
        """
        self.client.logout()
        self.client.force_authenticate(self.user_1)
        path = '/api/v1/covers'
        data = dict(event=self.event)
        response = self.client.post(path=path, data=data, content_type='json')
        url = "/api/v1/covers/currents"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json())

    def test_change_favorite(self):
        """
        Тест изменения избраного
        """
        self.client.logout()
        self.client.force_authenticate(self.user_1)
        cover = lessons_models.EventCovered._default_manager.create(
            user=self.user_1,
            event=self.event,
        )
        url = f"/api/v1/covers/{cover.pk}/toggle-favorite"
        response = self.client.get(url)
        cover = lessons_models.EventCovered._default_manager.get(pk=cover.pk)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(cover.favorite)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        cover = lessons_models.EventCovered._default_manager.get(pk=cover.pk)
        self.assertFalse(cover.favorite)

    def test_get_course(self):
        """
        Тест получение курса по ID
        """
        url = reverse(
            "lessons:course-detail",
            kwargs={"course_id": self.course.pk},
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_permission_get_course(self):
        """
        Тест блокировки получения доступа к курсу
        """
        self.client.logout()
        self.client.force_authenticate(self.user_1)
        url = reverse(
            "lessons:course-detail",
            kwargs={"course_id": self.course.pk},
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        self.client.logout()
        self.client.force_authenticate(self.user)

    def test_create_course(self):
        """
        Тест создания курса
        """
        url = "/api/v1/courses"
        data = dict(
            name="some_course",
            description="some_desc",
            beginner=True,
            image=None,
            profession=self.profession.pk,
            experiences=[
                self.experience.pk,
            ],
        )
        response = self.client.post(
            path=url,
            data=data,
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.json(),
            {
                "teacher": self.user.pk,
                "id": response.json()["id"],
                "beginner": True,
                "description": "some_desc",
                "experiences": [self.experience.pk],
                "image": None,
                "interval": None,
                "is_scorm": False,
                "lessons": [],
                "materials": {},
                "name": "some_course",
                "profession": self.profession.pk,
                "status": 'archive',
            },
        )

    def test_permission_create_course(self):
        """
        Тест прав доступа к созданию курса
        """
        self.client.logout()
        self.client.force_authenticate(self.user_1)
        url = "/api/v1/courses"
        data = dict(
            name="some_course",
            description="some_desc",
            beginer=True,
            image=None,
            profession=self.profession.pk,
            experiences=[
                self.experience.pk,
            ],
        )
        response = self.client.post(
            path=url,
            data=data,
            format="json",
        )
        self.assertEqual(response.status_code, 403)
        self.client.logout()
        self.client.force_authenticate(self.user)

    def test_update_course(self):
        """
        Тест обновления курса
        """
        url = f"/api/v1/courses/{self.course.pk}"
        data = dict(
            name="some_course_1",
            description="some_desc_1",
            beginer=False,
            image=None,
            profession=self.profession.pk,
            experiences=[
                self.experience.pk,
            ],
        )
        response = self.client.patch(
            path=url,
            data=data,
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "some_course_1")

    def test_permission_update_course(self):
        """
        Тест прав доступа к обновлению курса
        """
        self.client.logout()
        self.client.force_authenticate(self.user_1)
        url = f"/api/v1/courses/{self.course.pk}"
        data = dict(
            name="some_course_1",
            description="some_desc_1",
            beginer=False,
            image=None,
            profession=self.profession.pk,
            experiences=[
                self.experience.pk,
            ],
        )
        response = self.client.patch(
            path=url,
            data=data,
            format="json",
        )
        self.assertEqual(response.status_code, 403)
        self.client.logout()
        self.client.force_authenticate(self.user)

    def test_delete_course(self):
        """
        Тест удаления курса
        """
        url = f"/api/v1/courses/{self.course.pk}"
        response = self.client.delete(
            path=url,
        )
        self.assertEqual(response.status_code, 204)

    def test_permission_detele_course(self):
        """
        Тест прав доступа на удаление курса
        """
        self.client.logout()
        self.client.force_authenticate(self.user_1)
        url = f"/api/v1/courses/{self.course.pk}"
        response = self.client.delete(
            path=url,
        )
        self.assertEqual(response.status_code, 403)
        self.client.logout()
        self.client.force_authenticate(self.user)


class TestChain(APITestCase):
    """
    Полная цепочка
    """

    def setUp(self):
        self.profession = users_models.Profession._default_manager.create(
            en_name="builder",
            ru_name="строитель",
        )
        self.experience_4 = users_models.WorkExperience._default_manager.create(
            years=4,
        )
        self.experience_2 = users_models.WorkExperience._default_manager.create(
            years=2,
        )
        date_commencement = datetime.date(
            year=2023,
            month=1,
            day=1,
        )
        self.user = get_user_model()._default_manager.create(
            email="user@gmail.com",
            profession=self.profession,
            password="password",
            date_commencement=date_commencement,
            is_staff=True,
        )
        self.client.force_authenticate(user=self.user)

    @override_settings(MEDIA_ROOT=tempfile.TemporaryDirectory(prefix='mediatest').name)
    def test_chain(self):
        """
        Тесты цепочки
        """

        # ========================= courses =========================
        url = '/api/v1/courses'
        data = dict(
            name='Course',
            interval=datetime.timedelta(days=7),
            profession=self.profession.pk,
            experiences=[self.experience_4.pk, self.experience_2.pk],
        )
        response_course = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response_course.status_code, 201)
        self.assertEqual(response_course.json()['status'], 'archive')
        course = lessons_models.Course._default_manager.get(name=data['name'])

        data['name'] = 'Course_beginner'
        data.pop('interval')
        data['beginner'] = True
        data['experiences'].append(self.experience_2.pk)
        response_beginner = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response_beginner.status_code, 201)
        self.assertEqual(response_beginner.json()['status'], 'archive')
        self.assertTrue(response_beginner.json()['beginner'])
        course_beginner = lessons_models.Course._default_manager.get(name=data['name'])

        scorm_path = settings.TEST_SCORM_PATH
        with open(scorm_path, mode='b+r') as file:
            data = dict(
                scorm=file,
            )
            response = self.client.post(
                path=url,
                data=data,
                )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(),
                         dict(
                             id=response.json()['id'],
                             teacher=self.user.pk,
                             name='Первая помощь (часть 2)',
                             description=None,
                             interval=None,
                             materials={},
                             beginner=False,
                             image=None,
                             profession=None,
                             is_scorm=True,
                             lessons=[lessons_models.Lesson._default_manager.get(name='Первая помощь (часть 2)').pk,
                                      lessons_models.Lesson._default_manager.get(name='Первая помощь (часть 3)').pk],
                             experiences=[],
                             status='edit',
                         ))
        course_scorm = lessons_models.Course._default_manager.get(name='Первая помощь (часть 2)')
        self.assertEqual(course_scorm.lessons.count(), 2)
        self.assertEqual(course_scorm.teacher, self.user)

        url = f'/api/v1/courses/{course.pk}/upload-materials'
        file_path = settings.TEST_IMAGE_PATH
        with open(file_path, mode='b+r') as file:
            data = dict(
                file=file,
                file_type='Image',
            )
            response = self.client.post(path=url, data=data)
        self.assertEqual(response.status_code, 201)
        self.assertEquals(response.json()['materials'], course.materials.get().pk)

        # ========================= lessons =========================
        url = '/api/v1/lessons'
        data = dict(
            name='Lesson',
            serial=1,
            course=course.pk,
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()['started'])
        lesson = lessons_models.Lesson._default_manager.get(name=data['name'])
        self.assertEqual(lesson.test_block.lesson.pk, lesson.pk)

        data['name'] = 'Lesson_beginner'
        data['course'] = course_beginner.pk
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()['started'])
        lesson_beginner = lessons_models.Lesson._default_manager.get(name=data['name'])

        # ========================= questions =========================
        url = '/api/v1/questions'
        data = dict(
            text='question',
            weight=4,
            test_block=lesson.test_block.pk,
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)

        data['text'] = 'question_1'
        data['weight'] = 5
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)

        data = dict(
            text='question_b',
            weight=10,
            test_block=lesson_beginner.test_block.pk,
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)

        data['text'] = 'question_b_1'
        data['weight'] = 5
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)

        # ========================= steps =========================
        url = '/api/v1/step'
        data = dict(
            title='Step',
            content_text='Step_one',
            serial=1,
            lesson=lesson.pk,
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        step = lessons_models.Step._default_manager.get(
            title=data['title'],
        )

        data['title'] = 'Step_beginner'
        data['lesson'] = lesson_beginner.pk
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        step_beginner = lessons_models.Step._default_manager.get(
            title=data['title'],
        )

        # ========================= events =========================
        url = '/api/v1/events'
        data = dict(
            course=course.pk,
            start_date=datetime.datetime(year=2025, month=5, day=14),
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(PeriodicTask._default_manager.count(), 5)
        self.assertEqual(response.status_code, 201)
        event = lessons_models.Event._default_manager.get(course_id=data['course'])
        self.assertEqual(event.course.status, 'run')
        self.assertEqual(event.status, 'expected')

        url_delete = f'/api/v1/events/{event.pk}'
        response = self.client.delete(path=url_delete)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(PeriodicTask._default_manager.count(), 0)

        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        event = lessons_models.Event._default_manager.get(course_id=data['course'])

        data = dict(
            course=course_beginner.pk,
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(PeriodicTask._default_manager.count(), 5)
        self.assertEqual(response.status_code, 201)
        event_beginner = lessons_models.Event._default_manager.get(course_id=data['course'])

        self.assertEqual(event_beginner.course.status, 'run')
        self.assertEqual(event_beginner.status, 'started')
        self.assertEqual(event_beginner.end_date, None)
        self.assertEqual(event_beginner.start_date, None)

        response = self.client.get(
            path=url,
        )
        self.assertEqual(response.status_code, 200)

        lesson.refresh_from_db()
        lesson_beginner.refresh_from_db()

        data = dict(
            course=course_scorm.pk,
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(response.status_code, 422)

        url = f'/api/v1/courses/{course_scorm.pk}'
        data = dict(
            interval=datetime.timedelta(days=10)
        )
        response = self.client.patch(
            path=url,
            data=data,
            format='json',
        )
        course_scorm.refresh_from_db()
        self.assertEqual(course_scorm.status, 'archive')

        url = '/api/v1/events'
        data = dict(
            course=course_scorm.pk,
            start_date=datetime.datetime(year=2025, month=9, day=29)
        )
        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )
        self.assertEqual(PeriodicTask._default_manager.count(), 11)
        self.assertEqual(response.status_code, 201)

        scorm_event = lessons_models.Event._default_manager.get(course=course_scorm)

        url_delete = f'/api/v1/events/{scorm_event.pk}'
        response = self.client.delete(path=url_delete)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(PeriodicTask._default_manager.count(), 5)

        response = self.client.post(
            path=url,
            data=data,
            format='json',
        )

        scorm_event = lessons_models.Event._default_manager.get(course=course_scorm)

        url = f'/api/v1/courses/{course_beginner.pk}/users'
        response = self.client.get(path=url)
        self.assertEqual(response.status_code, 200)

        url = f'/api/v1/courses/{course_beginner.pk}/about'
        response = self.client.get(path=url)
        self.assertEqual(response.status_code, 200)

        url = '/api/v1/covers/main'
        response = self.client.get(path=url)
        self.assertEqual(response.status_code, 200)

        # ========================= test_block functions =========================

        self.assertEqual(lesson.test_block.max_score, 9)
        # Запрос был на 2025 05 21 00:00:00 по +3. На беке это 2025 05 20 21:00:00 +0
        self.assertEqual(str(lesson.test_block.end_date), str(datetime.datetime(year=2025, month=5, day=20, hour=21)) + '+00:00')
        self.assertEqual(lesson_beginner.test_block.max_score, 15)
        self.assertEqual(lesson_beginner.test_block.end_date, None)

        # ========================= event set functions =========================

        self.assertEqual(self.user.events.count(), 1)
        user_1 = get_user_model()._default_manager.create_user(
            email='user1@gmail.com',
            password='usersuseruser',
            profession=self.profession,
            date_commencement=datetime.date(
                year=2020,
                month=8,
                day=1,
                ),
        )
        self.assertEqual(user_1.events.count(), 1)

        # ========================= event registration =========================

        url = '/api/v1/covers'
        data = dict(
            event=event.pk,
            user=user_1.pk,
        )
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(user_1.events.count(), 2)

        data['event'] = scorm_event.pk
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, 201)

        url = '/api/v1/covers/currents'
        response = self.client.get(path=url)
        self.assertEqual(response.status_code, 200)

        # ========================= calendar =========================

        url = '/api/v1/covers/calendar'
        response = self.client.get(path=url)
        self.assertEqual(response.status_code, 200)

        # ========================= permissions =========================
        self.client.logout()
        self.client.force_authenticate(user=user_1)

        url = '/api/v1/courses'

        data = dict(
            name='fail_course',
            beginner=True,
        )
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, 403)

        url = '/api/v1/covers'
        data = dict(
            event=event_beginner.pk,
            user=user_1.pk
        )
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, 422)

        data['user'] = self.user.pk
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, 422)


class LessonViewSetTest(APITestCase):
    def setUp(self):
        """Настройка данных для тестов."""
        self.profession = users_models.Profession._default_manager.create(
            en_name="prof",
            ru_name="проф",
        )
        self.experience = users_models.WorkExperience._default_manager.create(
            years=0,
        )
        date_commencement = datetime.date(
            year=2023,
            month=1,
            day=1,
        )
        self.user = get_user_model()._default_manager.create(
            email="user@gmail.com",
            profession=self.profession,
            password="password",
            date_commencement=date_commencement,
            is_staff=True,
        )
        self._user = get_user_model()._default_manager.create(
            email="user@mail.ru",
            profession=self.profession,
            password="password",
            date_commencement=date_commencement,
        )
        self.client.force_authenticate(user=self.user)
        self.course = lessons_models.Course.objects.create(
            teacher=self.user,
            name="Курс 1",
            description="Описание курса 1",
            beginner=True,
            )
        self.lesson = lessons_models.Lesson.objects.create(
            teacher=self.user,
            name="Урок 1",
            serial=1,
            course=self.course,
            )

    def test_get_lesson_detail(self):
        """Тест детального представления урока."""
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Урок 1")
        self.assertEqual(response.data['course'], self.course.pk)

    def test_create_lesson(self):
        """Тест создания урока."""
        url = reverse('lessons:lesson-list')
        data = {
            "name": "Новый урок",
            "serial": 2,
            "course": self.course.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(lessons_models.Lesson.objects.count(), 2)

    def test_create_lesson_fail_serial(self):
        """Тест создания урока с не верным порядковым номером."""
        url = reverse('lessons:lesson-list')
        data = {
            "name": "Новый урок 2",
            "serial": 1,
            "course": self.course.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 422)

    def test_update_lesson(self):
        """Тест обновления урока."""
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        data = {
            "name": "Обновленный урок",
            "serial": 3,
            "course": self.course.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.lesson.refresh_from_db()
        self.assertEqual(self.lesson.name, "Обновленный урок")

    def test_delete_lesson(self):
        """Тест удаления урока."""
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(lessons_models.Lesson.objects.count(), 0)

    def test_permission_create_lesson(self):
        """Тест прав доступа на создание урока."""
        self.client.force_authenticate(user=self._user)
        url = reverse('lessons:lesson-list')
        data = {
            "name": "Новый урок",
            "serial": 2,
            "course": self.course.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_permission_update_lesson(self):
        """Тест прав доступа на обновление урока."""
        self.client.force_authenticate(user=self._user)
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        data = {
            "name": "Обновленный урок",
            "serial": 1,
            "course": self.course.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_permission_delete_lesson(self):
        """Тест прав доступа на удаление урока."""
        self.client.force_authenticate(user=self._user)
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_regular_user_can_view_lessons(self):
        """Тест, что обычный пользователь не может просматривать полный список уроков."""
        self.client.force_authenticate(user=self._user)

        list_url = reverse('lessons:lesson-list')
        list_response = self.client.get(list_url)
        self.assertEqual(list_response.status_code, status.HTTP_403_FORBIDDEN)

        detail_url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_403_FORBIDDEN)
