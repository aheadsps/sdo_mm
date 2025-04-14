import json
import datetime

from lessons.models import Course, Lesson, TestBlock
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from users import models as users_models


class TestBlockAPITestCase(APITestCase):
    def setUp(self):
        # Создаем тестовые данные
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
        self.lesson_data = {
            "teacher": self.user,
            "name": "Lesson 1",
            "serial": 1,
            "course": Course.objects.create(
                teacher=self.user,
                name="Course 1",
                interval=datetime.timedelta(days=7),
            )
        }
        self.lesson = Lesson.objects.create(**self.lesson_data)
        self.test_block_data = {"lesson": self.lesson,
                                "end_date": datetime.datetime(year=2027, month=1, day=1),
                                "max_score": 5.0,
                                }
        self.test_block = TestBlock.objects.create(**self.test_block_data)
        self.client.force_authenticate(self.user)

    def test_retrieve_test_block(self):
        """Тест получения деталей объекта TestBlock через API."""
        url = f'/api/v1/test-block/{self.test_block.pk}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["lesson"], self.test_block.lesson.pk)
