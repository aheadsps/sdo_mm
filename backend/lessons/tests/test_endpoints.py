import datetime

from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from lessons import models as lessons_models
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
        self.assertEqual(
            response.json(),
            {
                "id": self.event.pk,
                "course": {
                    "beginer": False,
                    "description": "some",
                    "experiences": [self.experience.pk],
                    "image": None,
                    "name": "course",
                    "profession": self.profession.pk,
                },
                "done_lessons": 0,
                "end_date": None,
                "favorite": False,
                "start_date": "2026-01-01T00:00:00+03:00",
                "status": "process",
                "user": self.user.pk,
            },
        )

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
            {'user': self.user.pk,
             'course': self.course.pk,
             'start_date': '2026-01-01T23:01:01+03:00',
             'end_date': '2027-01-01T23:01:01+03:00',
             'favorite': True,
             'status': 'expected',
             }
        )

    def test_update_event(self):
        """
        Тест обновления эвента
        """
        url = f"/api/v1/events/{self.event.pk}"
        data = dict(start_date=datetime.datetime(
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
            format='json',
        )
        self.assertEqual(response.status_code, 200)

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
        self.assertEqual(
            response.json(),
            {
                "count": 1,
                "next": None,
                "previous": None,
                "results": [
                    {
                        "user": self.user.pk,
                        "id": self.event.pk,
                        "course": {
                            "beginer": False,
                            "description": "some",
                            "experiences": [self.experience.pk],
                            "image": None,
                            "name": "course",
                            "profession": self.profession.pk,
                        },
                        "done_lessons": 0,
                        "end_date": None,
                        "favorite": False,
                        "start_date": "2026-01-01T00:00:00+03:00",
                        "status": "process",
                    }
                ],
            },
        )

    def test_change_favorite(self):
        """
        Тест изменения избраного
        """
        url = f'/api/v1/events/{self.event.pk}/toggle-favorite'
        self.assertFalse(self.event.favorite)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        event = lessons_models.Event.objects.get(pk=self.event.pk)
        self.assertTrue(event.favorite)
