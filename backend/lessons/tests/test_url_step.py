import datetime
from pathlib import Path

from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.urls import reverse
from django.core.files import File

from lessons.models import Step, ContentAttachment
from users import models as users_models


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
        group_profession = users_models.ProfessionGroup._default_manager.create(
            profession=self.profession,
        )
        group_profession.students.add(self.user)
        group_profession.save()
        # добавить в группу модераторов
        Group.objects.create(name="admin")
        group = Group.objects.create(name="methodist")
        group.user_set.add(self.user)
        # Даём разрешение на редактирование
        ct = ContentType.objects.get_for_model(Step)
        permission = Permission.objects.create(
            codename="can_change_step",
            name="Модерировать Step",
            content_type=ct,
        )
        group.permissions.add(permission)
        group.save()

        self.client = APIClient()
        self.client.login(username="user@gmail.com", password="password")
        self.client.force_authenticate(user=self.user)

    def test_step_url_create(self):
        """
        Добавление нового объекта в Step
        """
        url = '/api/v1/step'
        data = {
            "serial": 4,
            "title": "Шаг 4",
            "content_text": "content_text",
            "attachments": [],
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Step._default_manager.count(), 1)
        step = Step._default_manager.get()
        self.assertEqual(step.title, "Шаг 4")

        """
        Меняем объект в Step
        """
        url = f'/api/v1/step/{step.pk}'
        data = {
            "serial": 4,
            "title": "Шаг 4",
            "content_text": "Новый текст",
            "attachments": [{"file": None, "file-type": "Image"}],
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Step._default_manager.get().content_text, "Новый текст")

        """
        Выводим один объект Step
        """
        url = f'/api/v1/step/{step.pk}'
        response = self.client.get(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        """
        Выводим все объекты Step
        """
        url = f'/api/v1/step'
        response = self.client.get(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        """
        Удаляем объект Step 204_NO_CONTENT
        """
        url = f'/api/v1/step/{step.pk}'
        response = self.client.delete(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        """
        Добавление нового объекта в Step
        """
        url = '/api/v1/step'
        data = {
            "serial": -5,
            "title": "Шаг 4",
            "content_text": "content_text",
            "attachments": [],
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def test_update_step_attachements(self):
        """
        Тесты обновления вложеных объектов у Step
        """

        image_path: Path = settings.TEST_IMAGE_PATH
        image_path_2: Path = settings.TEST_IMAGE_PATH_2

        step = Step._default_manager.create(
            title="Some_step",
            content_text="Some_content",
        )
        url = f"/api/v1/step/{step.pk}"
        with image_path.open("rb") as image:
            content_at = ContentAttachment._default_manager.create(
                file=File(image),
                file_type="Image",
                step=step,
            )
        with image_path_2.open("rb") as image:

            data = {
                "serial": 1,
                "title": "Шаг 4",
                "content_text": "content_text",
                "attachments[0]file": image.raw,
                "attachments[0]file_type": "Image",
            }
            response = self.client.patch(url, data,  format='multipart')
        self.assertEqual(response.status_code, 200)
