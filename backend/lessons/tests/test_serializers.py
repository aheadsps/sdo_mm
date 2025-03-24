from lessons import models, serializers
from rest_framework.test import APITestCase


class TestSerializers(APITestCase):
    """
    Тесты Сериализаторов
    """

    def setUp(self):
        self.question_date = dict(
            text="Question",
            answers=[
                dict(
                    text="answer_1",
                    correct=True,
                ),
                dict(
                    text="answer_2",
                    correct=False,
                ),
                dict(
                    text="answer_3",
                    correct=False,
                ),
            ],
        )

    def test_create_question_with_answer(self):
        """
        Тест создания вопроса с ответами
        """
        serializer = serializers.QuestionSerializer(data=self.question_date)
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertEqual(models.Question._default_manager.count(), 1)
        self.assertEqual(models.Answer._default_manager.count(), 3)
        self.assertEqual(
            models.Answer._default_manager.first().question,
            instance,
        )
