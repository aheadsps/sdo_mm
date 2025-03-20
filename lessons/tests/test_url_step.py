from rest_framework.test import APITestCase
from lessons.models import Step
from rest_framework import status


class TestStepUrl(APITestCase):
    """
    Тесты основных функций модели Step
    """

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

        self.assertEqual(Step.objects.count(), 1)
        step = Step.objects.get()
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
        self.assertEqual(Step.objects.get().content_text, 'Новый текст')

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
