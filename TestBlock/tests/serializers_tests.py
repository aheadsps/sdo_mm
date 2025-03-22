from rest_framework.test import APITestCase

from lessons.models import Answer, Question
from TestBlock.models import TestBlock
from TestBlock.serializers import (TestBlockSerializersDetail,
                                   TestBlockSerializersOptimize)


class TestBlockSerializersOptimizeTests(APITestCase):
    """
    Тест сериализаторов
    """

    def setUp(self):
        # Создание тестовых данных
        self.question1 = Question.objects.create(text="Question 1")
        self.question2 = Question.objects.create(text="Question 2")
        self.answer1 = Answer.objects.create(text="Answer 1")
        self.answer2 = Answer.objects.create(text="Answer 2")
        self.test_block = TestBlock.objects.create(
            description="Test Description",
            questions=[self.question1, self.question2],
            answers=[self.answer1, self.answer2],
        )

    def test_serialize(self):
        # Проверка сериализации
        serializer = TestBlockSerializersOptimize(self.test_block)
        expected_data = {
            "id": self.test_block.pk,
            "description": "Test Description",
            "questions": [
                {"id": self.question1.pk, "text": "Question 1"},
                {"id": self.question2.pk, "text": "Question 2"},
            ],
            "answers": [
                {"id": self.answer1.pk, "text": "Answer 1"},
                {"id": self.answer2.pk, "text": "Answer 2"},
            ],
        }
        self.assertEqual(serializer.data, expected_data)

    def test_deserialize(self):
        # Проверка десериализации
        data = {
            "description": "New Description",
            "questions": [{"id": self.question1.pk}, {"id": self.question2.pk}],
            "answers": [{"id": self.answer1.pk}, {"id": self.answer2.pk}],
        }
        serializer = TestBlockSerializersOptimize(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["description"], "New Description")
        self.assertEqual(
            serializer.validated_data["questions"], [self.question1, self.question2]
        )
        self.assertEqual(
            serializer.validated_data["answers"], [self.answer1, self.answer2]
        )


class TestBlockSerializersDetailTests(APITestCase):
    def setUp(self):
        # Создание тестовых данных
        self.question1 = Question.objects.create(text="Question 1")
        self.question2 = Question.objects.create(text="Question 2")
        self.answer1 = Answer.objects.create(text="Answer 1")
        self.answer2 = Answer.objects.create(text="Answer 2")
        self.test_block = TestBlock.objects.create(
            description="Test Description",
            questions=[self.question1, self.question2],
            answers=[self.answer1, self.answer2],
        )

    def test_serialize_with_user_story(self):
        # Проверка сериализации с user_story
        serializer = TestBlockSerializersDetail(self.test_block)
        expected_data = {
            "id": self.test_block.pk,
            "description": "Test Description",
            "questions": [
                {"id": self.question1.pk, "text": "Question 1"},
                {"id": self.question2.pk, "text": "Question 2"},
            ],
            "answers": [
                {"id": self.answer1.pk, "text": "Answer 1"},
                {"id": self.answer2.pk, "text": "Answer 2"},
            ],
            "user_story": None,  # Замените на ожидаемое значение user_story
        }
        self.assertEqual(serializer.data, expected_data)

    def test_deserialize_with_user_story(self):
        # Проверка десериализации с user_story
        data = {
            "description": "New Description",
            "questions": [{"id": self.question1.pk}, {"id": self.question2.pk}],
            "answers": [{"id": self.answer1.pk}, {"id": self.answer2.pk}],
            "user_story": "Some user story",  # Замените на ожидаемое значение user_story
        }
        serializer = TestBlockSerializersDetail(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["description"], "New Description")
        self.assertEqual(
            serializer.validated_data["questions"], [self.question1, self.question2]
        )
        self.assertEqual(
            serializer.validated_data["answers"], [self.answer1, self.answer2]
        )
        self.assertEqual(serializer.validated_data["user_story"], "Some user story")
