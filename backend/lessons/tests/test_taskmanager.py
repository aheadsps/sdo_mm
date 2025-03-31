from rest_framework.test import APITestCase, APIClient
from users import models as users_models
from django.contrib.auth import get_user_model
import datetime
from pathlib import Path
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from users.models import WorkExperience
from lessons.models import Course
from lessons.taskmanager import TaskManager
from django_celery_beat.models import PeriodicTask
import json


class TestStepUrl(APITestCase):
    """
    Тесты основных функций модели Step
    """

    def setUp(self):
        """
        Подключение пользователя
        """
        self.profession = users_models.Profession._default_manager.create(
            en_name="prof",
            ru_name="проф",
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
        self.user.set_password("password")
        self.user.save()

        self.client = APIClient()
        self.client.login(username="user@gmail.com", password="password")
        self.client.force_authenticate(user=self.user)

        experiences = WorkExperience._default_manager.create(years=1)
        course = Course(name="Название", description="Описание")
        course.save()
        course.experiences.add(experiences)

    def test_taks(self):
        """
        Создание задачи для эвента
        """
        date_time_str = '2038-06-29 08:15:27.243860'
        date_time_obj = datetime.datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S.%f')
        # создается задача
        TaskManager(1, self.user.pk, [1], date_time_obj).create()
        TaskManager(1, self.user.pk, [1], date_time_obj).create()

        # проверка
        rezults = PeriodicTask.objects.all()
        for rezult in rezults:
            rezult_ok = {
                "course_id": 1,
                "user_creata": self.user.pk,
                "user": [1],
                "start_date": "2038-06-29 08:15",
                "end_date": None
            }
            rezult_ok = json.dumps(rezult_ok)
            self.assertEqual(rezult.kwargs, rezult_ok)

        """
        Изменение задачи для эвента
        """
        id_task_1 = 1
        TaskManager(1, self.user.pk, [2], date_time_obj).upload(id_task_1)

        date_time_str2 = '2038-06-30 09:00:00.000000'
        date_time_obj2 = datetime.datetime.strptime(date_time_str2, '%Y-%m-%d %H:%M:%S.%f')

        """
        Изменение задачи для эвента и шедулера
        """
        id_task_2 = 2
        TaskManager(1, self.user.pk, [1, 2], date_time_obj2).upload(id_task_2)

        # проверка
        rezults_2 = PeriodicTask.objects.all()

        rezults_json_1 = json.dumps({"course_id": 1,
                                     "user_creata": 53,
                                     "user": [2],
                                     "start_date": "2038-06-29 08:15",
                                     "end_date": None,
                                     })
        self.assertEqual(rezults_2[0].kwargs, rezults_json_1)

        rezults_json_2 = json.dumps({"course_id": 1,
                                     "user_creata": 53,
                                     "user": [1, 2],
                                     "start_date": "2038-06-30 09:00",
                                     "end_date": None,
                                     })
        self.assertEqual(rezults_2[1].kwargs, rezults_json_2)

        self.assertEqual(rezults_2[0].schedule.clocked_time.strftime("%Y-%m-%d %H:%M"),
                         "2038-06-29 05:15")

        self.assertEqual(rezults_2[1].schedule.clocked_time.strftime("%Y-%m-%d %H:%M"),
                         "2038-06-30 06:00")
