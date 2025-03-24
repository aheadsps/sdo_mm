from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from lessons.models import Course, Lesson, TestBlock


class TestBlockAPITestCase(APITestCase):
    def setUp(self):
        # Создаем тестовые данные
        self.lesson_data = {
            "name": "Lesson 1",
            "serial": 1,
            "course": Course.objects.create(
                name="Course 1"
            ).pk,  # Создаем связанный курс
        }
        self.lesson = Lesson.objects.create(**self.lesson_data)
        self.test_block_data = {"lessons": self.lesson.pk}
        self.test_block = TestBlock.objects.create(**self.test_block_data)

    def test_create_test_block(self):
        """Тест создания нового объекта TestBlock через API."""
        url = reverse("test-block-list-create")
        response = self.client.post(url, self.test_block_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TestBlock.objects.count(), 2)
        self.assertEqual(response.data["lessons"], self.test_block_data["lessons"])

    def test_list_test_blocks(self):
        """Тест получения списка объектов TestBlock через API."""
        url = reverse("test-block-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["lessons"], self.test_block.lessons.pk)

    def test_retrieve_test_block(self):
        """Тест получения деталей объекта TestBlock через API."""
        url = reverse("test-block-detail", kwargs={"pk": self.test_block.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["lessons"], self.test_block.lessons.pk)

    def test_update_test_block(self):
        """Тест обновления объекта TestBlock через API."""
        url = reverse("test-block-detail", kwargs={"pk": self.test_block.pk})
        updated_data = {"lessons": self.lesson.pk + 1}  # Обновляем уроки
        response = self.client.put(url, updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            TestBlock.objects.get(pk=self.test_block.pk).lessons_id, self.lesson.pk + 1
        )

    def test_delete_test_block(self):
        """Тест удаления объекта TestBlock через API."""
        url = reverse("test-block-detail", kwargs={"pk": self.test_block.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TestBlock.objects.count(), 0)
