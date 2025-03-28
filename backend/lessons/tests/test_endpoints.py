import datetime

from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
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
            name="course",
            description="some",
            profession=self.profession,
        )
        self.course.experiences.add(
            self.experience,
        )
        self.course.save()
        self.event = lessons_models.Event._default_manager.create(
            user=self.user,
            course=self.course,
            start_date=datetime.datetime(year=2026, month=1, day=1),
            end_date=None,
        )
        self.curr_time_event = str(
            UTCTimeCast(
                input_time=self.course.create_date,
                UTC=3,
            ).get_UTC_set_time()
        ).replace(" ", "T")
        self.client.force_authenticate(self.user)

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

    def test_create_event_start_date_fail(self):
        """
        Тест создания эвента
        """
        url = "/api/v1/events"
        data = dict(
            user=self.user.pk,
            course=self.course.pk,
            favorite=True,
            start_date=datetime.datetime(
                year=2023,
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

    def test_create_event_end_date_fail(self):
        """
        Тест создания эвента
        """
        url = "/api/v1/events"
        data = dict(
            user=self.user.pk,
            course=self.course.pk,
            favorite=True,
            end_date=datetime.datetime(
                year=2023,
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

    def test_create_event_reverse_dates(self):
        """
        Тест создания эвента
        """
        url = "/api/v1/events"
        data = dict(
            user=self.user.pk,
            course=self.course.pk,
            favorite=True,
            start_date=datetime.datetime(
                year=2026,
                month=1,
                day=1,
                hour=23,
                minute=1,
                second=1,
            ),
            end_date=datetime.datetime(
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

    def test_create_event(self):
        """
        Тест создания эвента
        """
        url = "/api/v1/events"
        data = dict(
            user=self.user.pk,
            course=self.course.pk,
            favorite=True,
            start_date=datetime.datetime(
                year=2026,
                month=1,
                day=1,
                hour=23,
                minute=1,
                second=1,
            ),
            end_date=datetime.datetime(
                year=2027,
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
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.json(),
            {
                "user": self.user.pk,
                "course": self.course.pk,
                "start_date": "2026-01-01T23:01:01+03:00",
                "end_date": "2027-01-01T23:01:01+03:00",
                "favorite": True,
                "status": "expected",
            },
        )

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
        self.assertEqual(response.json(), 200)

    def test_delete_event(self):
        """
        Тест удаления эвента
        """
        url = f"/api/v1/events/{self.event.pk}"
        response = self.client.delete(
            path=url,
        )
        self.assertEqual(response.status_code, 204)

    def test_get_list_current_events(self):
        """
        Тест получения актуальных эвентов на пользователе
        """
        url = "/api/v1/events/currents"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_change_favorite(self):
        """
        Тест изменения избраного
        """
        url = f"/api/v1/events/{self.event.pk}/toggle-favorite"
        self.assertFalse(self.event.favorite)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        event = lessons_models.Event.objects.get(pk=self.event.pk)
        self.assertTrue(event.favorite)

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
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.json(),
            {
                "beginer": True,
                "description": "some_desc",
                "experiences": [self.experience.pk],
                "image": None,
                "name": "some_course",
                "profession": self.profession.pk,
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
        self.course = lessons_models.Course.objects.create(name="Курс 1",
                                            description="Описание курса 1")
        self.lesson = lessons_models.Lesson.objects.create(name="Урок 1",
                                            serial=1, course=self.course)

    def test_get_lesson_detail(self):
        """Тест детального представления урока."""
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Урок 1")
        self.assertEqual(response.data['course'], 3)

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

    def test_update_lesson(self):
        """Тест обновления урока."""
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        data = {
            "name": "Обновленный урок",
            "serial": 1,
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
