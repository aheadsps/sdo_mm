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

        experiences=WorkExperience._default_manager.create(years=1)
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
        TaskManager(1, self.user.pk,[1], date_time_obj).create()
        TaskManager(1, self.user.pk,[1], date_time_obj).create()
        # проверка
        rezults = PeriodicTask.objects.all()
        for rezult in rezults:
            print("----------*******",rezult)
            rezult_ok = {
                "course_id": 1,
             "user": [1],
             "start_date": "2038-June-29 08:15",
             "end_date": None
             }
            rezult_ok = json.dumps(rezult_ok)
            print("****************",rezult.kwargs)
            self.assertEqual(rezult.kwargs, rezult_ok)


