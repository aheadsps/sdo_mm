from django.test import TestCase
from django.urls import reverse

from TestBlock.models import TestBlock


class TestBlockViewSetTests(TestCase):
    def setUp(self):
        # Создание тестовых блоков
        self.block1 = TestBlock.objects.create(description="Test Block 1")
        self.block2 = TestBlock.objects.create(description="Test Block 2")

    def test_list(self):
        url = reverse("test_block-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.block1.description)
        self.assertContains(response, self.block2.description)

    def test_retrieve_test_block(self):
        url = reverse("test_block-detail", args=[self.block1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.block1.description)

    def test_reset_answers(self):
        url = reverse("test_block-reset-answers", args=[self.block1.pk])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        # Проверка того, что ответы были сброшены (здесь предполагаем, что ответы проверяются через `assertEquals`)
        self.assertEquals(self.block1.answers.count(), 0)
