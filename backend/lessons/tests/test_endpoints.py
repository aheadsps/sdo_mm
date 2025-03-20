import datetime

from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from lessons import models as lessons_models
from users import models as users_models


class TestEndpointsEvents(APITestCase):
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
            start_date=None,
            end_date=None,
        )
        self.client.force_authenticate(self.user)

    def test_get_course(self):
        """
        Тест получение Эвента по ID
        """
        url = reverse("lessons:event-detail",
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
                "start_date": None,
                "status": "expected",
            },
        )

    def test_create_evetn(self):
        """
        Тест создания эвента
        """
        url = '/api/v1/events'
        data = dict(
            course=self.course.pk,
            done_lessons=0,
            favorite=True,
            status='done',
        )
        response = self.client.post(
            path=url,
            data=data,
        )
        self.assertEqual(response.content, 204)

    def test_get_list_current_events(self):
        """
        Тест получения актуальных эвентов на пользователе
        """
        url = '/api/v1/events/currents'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {'count': 1,
             'next': None,
             'previous': None,
             'results': [
                 {'course': {'beginer': False,
                             'description': 'some',
                             'experiences': [self.experience.pk],
                             'image': None,
                             'name': 'course',
                             'profession': self.profession.pk},
                  'done_lessons': 0,
                  'end_date': None,
                  'favorite': False,
                  'id': self.event.pk,
                  'start_date': None,
                  'status': 'expected'}]}
            )
