from django.test import TestCase
from django.urls import reverse

from lessons.models import Answer, Question
from TestBlock.models import TestBlock


class TestBlockViewSetTests(TestCase):
    def setUp(self):
        # Создание тестовых блоков
        self.block1 = TestBlock.objects.create(description="Test Block 1")
        self.block2 = TestBlock.objects.create(description="Test Block 2")

        # Создание тестовых вопросов и ответов
        self.question1 = Question.objects.create(text="Question 1")
        self.question2 = Question.objects.create(text="Question 2")
        self.answer1 = Answer.objects.create(text="Answer 1")
        self.answer2 = Answer.objects.create(text="Answer 2")

        # Привязка вопросов и ответов к блокам
        self.block1.questions.add(self.question1)
        self.block1.answers.add(self.answer1)
        self.block2.questions.add(self.question2)
        self.block2.answers.add(self.answer2)

    def test_list(self):
        url = reverse("testblock-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.block1.description)
        self.assertContains(response, self.block2.description)

    def test_retrieve_test_block(self):
        url = reverse("testblock-detail", args=[self.block1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.block1.description)
        self.assertContains(response, self.question1.text)
        self.assertContains(response, self.answer1.text)

    def test_reset_answers(self):
        url = reverse("testblock-reset-answers", args=[self.block1.pk])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, self.answer1.text)
        self.assertEquals(self.block1.answers.count(), 0)
