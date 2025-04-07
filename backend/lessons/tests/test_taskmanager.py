from rest_framework.test import APITestCase, APIClient
from users import models as users_models
from django.contrib.auth import get_user_model
import datetime
from django.core.exceptions import ObjectDoesNotExist
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

        date_end_time_str = '2039-06-29 08:15:27.243860'
        date_end_time_obj = datetime.datetime.strptime(date_end_time_str, '%Y-%m-%d %H:%M:%S.%f')
        # создается задача
        TaskManager(1, [1], date_time_obj).create()
        TaskManager(1, [1], date_time_obj, date_end_time_obj).create()

        # проверка
        rezults = PeriodicTask.objects.all()
        #for rezult in rezults:
        rezult_ok = {
                "course_id": 1,
                "users": [1],
                "start_date": "2038-06-29 08:15",
                "end_date": None
        }
        rezult_ok = json.dumps(rezult_ok)
        self.assertEqual(rezults[0].kwargs, rezult_ok)

        """
        Изменение задачи для эвента
        """

        TaskManager(1, [1, 2], date_time_obj).upload()

        date_time_str2 = '2038-06-30 09:00:00.000000'
        date_time_obj2 = datetime.datetime.strptime(date_time_str2, '%Y-%m-%d %H:%M:%S.%f')

        TaskManager(1, [1], date_time_obj2).create()
        TaskManager(1, [2], date_time_obj2).create()
        """
        Изменение задачи для эвента и шедулера
        """

        TaskManager(1, [2], date_time_obj).upload()

        # проверка
        rezults_2 = PeriodicTask.objects.all()

        rezults_json_1 = json.dumps({"course_id": 1,
                                     "users": [2],
                                     "start_date": "2038-06-29 08:15",
                                     "end_date": None,
                                     })
        self.assertEqual(rezults_2[2].kwargs, rezults_json_1)

        rezults_json_2 = json.dumps({"course_id": 1,
                                     "users": [1, 2],
                                     "start_date": "2038-06-30 09:00",
                                     "end_date": None,
                                     })
        self.assertEqual(rezults_2[1].kwargs, rezults_json_2)

        self.assertEqual(rezults_2[2].schedule.clocked_time.strftime("%Y-%m-%d %H:%M"),
                         "2038-06-29 05:15")

        self.assertEqual(rezults_2[1].schedule.clocked_time.strftime("%Y-%m-%d %H:%M"),
                         "2038-06-30 06:00")

        """
        Изменение даты финиша
        """
        date_time_str3 = '2039-06-29 09:00:00.000000'
        date_end_time_obj3 = datetime.datetime.strptime(date_time_str3, '%Y-%m-%d %H:%M:%S.%f')
        TaskManager(1, [2], date_time_obj2, date_end_time_obj3).upload()


        rezults_3 = PeriodicTask.objects.get(name='Fail_1_at_2039-06-29 09:00')
        rezults_json_3 = json.dumps({"course_id": 1,
                                     "users": [2],
                                     })
        self.assertEqual(rezults_3.kwargs, rezults_json_3)

        """
        Изменение даты финиша и студентов
        """
        date_time_str3 = '2040-06-29 00:00:00.000000'
        date_end_time_obj3 = datetime.datetime.strptime(date_time_str3, '%Y-%m-%d %H:%M:%S.%f')
        TaskManager(1, [1], date_time_obj2, date_end_time_obj3).upload()

        rezults_3 = PeriodicTask.objects.get(name='Fail_1_at_2040-06-29 00:00')
        rezults_json_3 = json.dumps({"course_id": 1,
                                     "users": [1],
                                     })
        self.assertEqual(rezults_3.kwargs, rezults_json_3)
        # Проверка что удалили студентов
        rezults_4 = PeriodicTask.objects.get(name='Fail_1_at_2039-06-29 09:00')
        rezults_json_4 = json.dumps({"course_id": 1,
                                     "users": [],
                                     })
        self.assertEqual(rezults_4.kwargs, rezults_json_4)



        """
        А если нет такой задачи? 
        """
        with self.assertRaises(ObjectDoesNotExist):
            TaskManager(2, [2], date_time_obj).upload()


        """
        Бессрочный курс
        """
        TaskManager(1, [1, 2], date_time_obj2).upload()
        rezults_5 = PeriodicTask.objects.get(name='Event_1_at_2038-06-30 09:00')
        rezults_json_5 = json.dumps({"course_id": 1,
                                     "users": [1, 2],
                                     "start_date": "2038-06-30 09:00",
                                     "end_date": None,
                                     })
        self.assertEqual(rezults_5.kwargs, rezults_json_5)

        rezults_6 = PeriodicTask.objects.get(name='Fail_1_at_2040-06-29 00:00')
        rezults_json_6 = json.dumps({"course_id": 1,
                                     "users": [],
                                     })
        self.assertEqual(rezults_6.kwargs, rezults_json_6)



        """
        Удаляем пользователя [1] из списка
        """
        TaskManager(1, [1, 2], date_time_obj2, date_end_time_obj3).upload()
        rezults_7 = PeriodicTask.objects.get(name='Event_1_at_2038-06-30 09:00')
        rezults_json_7 = json.dumps({"course_id": 1,
                                     "users": [1, 2],
                                     "start_date": "2038-06-30 09:00",
                                     "end_date": "2040-06-29 00:00",
                                     })
        self.assertEqual(rezults_7.kwargs, rezults_json_7)

        TaskManager(1, [1], date_time_obj2, date_end_time_obj3).delete()
        rezults_8 = PeriodicTask.objects.get(name='Event_1_at_2038-06-30 09:00')
        rezults_json_8 = json.dumps({"course_id": 1,
                                     "users": [2],
                                     "start_date": "2038-06-30 09:00",
                                     "end_date": "2040-06-29 00:00"
                                     })
        self.assertEqual(rezults_8.kwargs, rezults_json_8)

        rezults_9 = PeriodicTask.objects.get(name='Fail_1_at_2040-06-29 00:00')
        rezults_json_9 = json.dumps({"course_id": 1,
                                     "users": [2]
                                     })
        self.assertEqual(rezults_9.kwargs, rezults_json_9)







