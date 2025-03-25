import json

from lessons.models import Course, Lesson, TestBlock
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase


class TestBlockAPITestCase(APITestCase):
    def setUp(self):
        # Создаем тестовые данные
        self.lesson_data = {
            "name": "Lesson 1",
            "serial": 1,
            "course": Course.objects.create(
                name="Course 1"
            )
        }
        self.lesson = Lesson.objects.create(**self.lesson_data)
        self.test_block_data = {"lesson": self.lesson}
        self.test_block = TestBlock.objects.create(**self.test_block_data)

    def test_create_test_block(self):
        """Тест создания нового объекта TestBlock через API."""
        url = reverse("lessons:list_create_test_block")

        # Преобразуем lesson.id в сериализуемый формат
        data = {
            'lesson': self.test_block_data['lesson'].id
        }
        json_data = json.dumps(data)
        response = self.client.post(
            url,
            data=json_data,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(TestBlock.objects.count(), 2)

        self.assertEqual(response.data["lesson"], self.test_block_data["lesson"].id)

    def test_list_test_blocks(self):
        """Тест получения списка объектов TestBlock через API."""
        url = reverse("lessons:list_create_test_block")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["lesson"], self.test_block.lesson.pk)

    def test_retrieve_test_block(self):
        """Тест получения деталей объекта TestBlock через API."""
        url = reverse("lessons:retrieve_update_delete_test_block", kwargs={"pk": self.test_block.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["lesson"], self.test_block.lesson.pk)

    def test_update_test_block(self):
        """Тест обновления объекта TestBlock через API."""
        new_lesson = Lesson.objects.create(name=f"New Lesson {self.lesson.pk + 1}", course=self.lesson.course)

        url = reverse("lessons:retrieve_update_delete_test_block", kwargs={"pk": self.test_block.pk})
        updated_data = {"lesson": new_lesson.pk}
        json_updated_data = json.dumps(updated_data)
        response = self.client.put(url, json_updated_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            TestBlock.objects.get(pk=self.test_block.pk).lesson_id, new_lesson.pk
        )

    def test_delete_test_block(self):
        """Тест удаления объекта TestBlock через API."""
        url = reverse("lessons:retrieve_update_delete_test_block", kwargs={"pk": self.test_block.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(TestBlock.DoesNotExist):
            TestBlock.objects.get(pk=self.test_block.pk)
