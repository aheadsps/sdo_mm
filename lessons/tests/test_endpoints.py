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
        profession = users_models.Profession._default_manager.create(
            en_name='prof',
            ru_name='проф',
        )
        experience = users_models.WorkExperience._default_manager.create(
            years=0,
        )
        self.user = get_user_model()._default_manager.create(
            email='user@gmail.com',
            profession=profession,
            password='password',
        )
        group_profession = users_models.ProfessionGroup._default_manager.create(
            profession=profession,
        )
        group_profession.students.add(self.user)
        group_profession.save()
        self.course = lessons_models.Course._default_manager.create(
            name='course',
            description='some',
            profession=profession,
        )
        self.course.experiences.add(
            experience,
        )
        self.course.save()
        self.client.force_authenticate(self.user)

    def test_get_course(self):
        """
        Тест получение курса по ID
        """
        url = reverse('lessons:course_retrieve',
                      kwargs={'pk': self.course.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code == '200')
