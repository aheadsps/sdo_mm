import datetime
import os

import django
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from lessons import models as lessons_models
from lessons.models import Course, Lesson
from users import models as users_models

from users.models import User


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
        url = reverse("lessons:event-detail", kwargs={"event_id": self.event.pk})
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

    def test_get_list_currect_events(self):
        """
        Тест получения актуальных эвентов на пользователе
        """


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
        self.client.force_authenticate(user=self.user)
        self.course = Course.objects.create(name="Курс 1",
                                            description="Описание курса 1")
        self.lesson = Lesson.objects.create(name="Урок 1",
                                            serial=1, course=self.course)

    def test_get_lesson_detail(self):
        """Тест детального представления урока (Retrieve)."""
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Урок 1")
        self.assertEqual(response.data['course']['name'], "Курс 1")

    def test_create_lesson(self):
        """Тест создания урока (Create)."""
        url = reverse('lessons:lesson-list')
        data = {
            "name": "Новый урок",
            "serial": 2,
            "course": self.course.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lesson.objects.count(), 2)

    def test_update_lesson(self):
        """Тест обновления урока (Update)."""
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
        """Тест удаления урока (Delete)."""
        url = reverse('lessons:lesson-detail', args=[self.lesson.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Lesson.objects.count(), 0)
