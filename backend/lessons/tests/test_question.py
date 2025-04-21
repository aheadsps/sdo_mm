from django.test import TestCase
from lessons.models import Question, TestBlock


class QuestionModelTest(TestCase):
    def setUp(self):
        # Создаем тестовый блок
        self.test_block = TestBlock.objects.create(title="Test Block")

        # Создаем вопрос
        self.question = Question.objects.create(
            text="вопрос",
            test_block=self.test_block
        )

    def test_str_method(self):
        """
        Проверяем метод __str__ модели Question
        """
        expected_str = "ответ"
        self.assertEqual(str(self.question), expected_str)

    def test_image_field(self):
        """
        Проверяем, что поле image может быть пустым
        """
        question_without_image = Question.objects.get(pk=self.question.pk)
        self.assertIsNone(question_without_image.image)

        # Добавляем изображение
        question = Question(
            text="Вопрос с изображением",
            image="path/to/image.jpg",
            test_block=self.test_block,
        )
        question.save()
        self.assertTrue(question.image)