import datetime
from django_celery_beat.models import PeriodicTask
import json
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from lessons.tasks import update_status_events
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
                "course": self.course.pk,
                "start_date": "2026-01-01T23:01:01+03:00",
                "end_date": "2027-01-01T23:01:01+03:00",
                "status": "expected",
            },
        )
        # проверим, что event записался
        rezults = lessons_models.Event.objects.get(pk=2)
        self.assertEqual(rezults.course.pk, self.course.pk)
        self.assertEqual(rezults.status, "expected")

        # проверим, что созданы задачи periodictask
        rezults = PeriodicTask.objects.all()
        rezults_json_0 = json.dumps({"pk": 2,
                                     "status": 'process',
                                     })
        rezults_json_1 = json.dumps({"pk": 2,
                                     "status": 'finished',
                                     })
        self.assertEqual(rezults[0].kwargs, rezults_json_0)
        self.assertEqual(rezults[1].kwargs, rezults_json_1)

        # Проверим работу функции задачи
        rst = update_status_events.apply(kwargs={
            "pk": 2,
            "status": 'process',
        }).get()


        # проверим, что event переписался
        rezults = lessons_models.Event.objects.get(pk=2)
        self.assertEqual(rezults.course.pk, self.course.pk)
        self.assertEqual(rezults.status, "process")

        # Проверим работу функции задачи 2
        rst = update_status_events.apply(kwargs={
            "pk": 2,
            "status": 'finished',
        }
        )

        # проверим, что event переписался
        rezults = lessons_models.Event.objects.get(pk=2)
        self.assertEqual(rezults.course.pk, self.course.pk)
        self.assertEqual(rezults.status, "finished")