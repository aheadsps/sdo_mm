from rest_framework.test import APITestCase

from lessons import serializers
from lessons import models


class TestSerializers(APITestCase):
    """
    Тесты Сериализаторов
    """

    def test_create_question_with_answer(self):
        """
        Тест создания вопроса с ответами
        """
        data = dict(
            text='Question',
            answers=[
                dict(text='answer_1',
                     correct=True,
                     ),
                dict(text='answer_2',
                     correct=False,
                     ),
                dict(text='answer_3',
                     correct=False,
                     ),
            ]
        )
        serializer = serializers.QuestionSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertEqual(models.Question._default_manager.count(), 1)
        self.assertEqual(models.Answer._default_manager.count(), 3)
        self.assertEqual(models.Answer._default_manager.first().question,
                         instance,
                         )
