from rest_framework.test import APITestCase, APIClient
from lessons.models import Step
from rest_framework import status
from users import models as users_models
import datetime
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

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
        )
        self.user.set_password("password")
        self.user.save()
        group_profession = users_models.ProfessionGroup._default_manager.create(
            profession=self.profession,
        )
        group_profession.students.add(self.user)
        group_profession.save()
        # добавить в группу модераторов
        Group.objects.create(name='admin')
        group = Group.objects.create(name='methodist')
        group.user_set.add(self.user)
        ct = ContentType.objects.get_for_model(Step)
        permission = Permission.objects.create(
            codename="can_change_step",
            name="Модерировать Step",
            content_type=ct,
        )
        #group.permissions.add(permission)
        group.save()

        self.client = APIClient()
        self.client.login(username='user@gmail.com', password='password')
        self.client.force_authenticate(user=self.user)


    def test_step_url_create(self):
        """
        Добавление нового объекта в Step
        """
        url = '/step/'
        data = {
            "serial": 4,
            "title": "Шаг 4",
            "content_text": "content_text",
            "content_attachment": [
                {"file": None,
                 "file-type": "Video"}
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Step._default_manager.count(), 1)
        step = Step._default_manager.get()
        self.assertEqual(step.title, 'Шаг 4')

        """
        Меняем объект в Step
        """
        url = '/step/' + str(step.id) + '/'
        data = {
            "serial": 4,
            "title": "Шаг 4",
            "content_text": "Новый текст",
            "content_attachment": [
                {"file": None,
                 "file-type": "Image"}
            ]
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Step._default_manager.get().content_text, 'Новый текст')

        """
        Выводим один объект Step
        """
        url = '/step/' + str(step.id) + '/'
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        """
        Выводим все объекты Step
        """
        url = '/step/'
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        """
        Удаляем объект Step 204_NO_CONTENT
        """
        url = '/step/' + str(step.id) + '/'
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)






