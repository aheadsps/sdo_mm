

from rest_framework.test import APITestCase
from rest_framework import status
from backend.lessons.models import Question, Answer
from django.contrib.auth import get_user_model
from rest_framework import serializers


class AnswerSerializerTest(APITestCase):
    def test_answer_serializer(self):
        """
        Проверка сериализатора для ответа
        """
        answer_data = {
            "text": "Ответ 1",
            "correct": True
        }
        serializer = Answer(data=answer_data)
        self.assertTrue(serializer.is_valid())
        answer = serializer.save()

        # Проверка, что ответ сохранён в базе
        self.assertEqual(answer.text, answer_data["text"])
        self.assertEqual(answer.correct, answer_data["correct"])

    def test_invalid_answer_serializer(self):
        """
        Проверка сериализатора для ответа с ошибками
        """
        invalid_answer_data = {
            "text": "",
            "correct": "invalid"  # неверный тип для correct
        }
        serializer = Answer(data=invalid_answer_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('text', serializer.errors)
        self.assertIn('correct', serializer.errors)


class QuestionSerializerTest(APITestCase):
    def test_question_serializer(self):
        """
        Проверка сериализатора для вопроса с ответами
        """
        question_data = {
            "text": "Какой сегодня день?",
            "answers": [
                {"text": "Понедельник", "correct": True},
                {"text": "Вторник", "correct": False}
            ]
        }
        serializer = Question(data=question_data)
        self.assertTrue(serializer.is_valid())
        question = serializer.save()

        # Проверка сохранения вопроса и ответов
        self.assertEqual(question.text, question_data["text"])
        self.assertEqual(question.answers.count(), 2)

        # Проверка каждого ответа
        answers = question.answers.all()
        self.assertEqual(answers[0].text, "Понедельник")
        self.assertEqual(answers[1].text, "Вторник")

    def test_invalid_question_serializer(self):
        """
        Проверка сериализатора для вопроса с ошибками
        """
        invalid_question_data = {
            "text": "",
            "answers": [
                {"text": "Ответ 1", "correct": True}
            ]
        }
        serializer = Question(data=invalid_question_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('text', serializer.errors)

    def test_create_question_with_answers(self):
        """
        Проверка метода create для вопроса с ответами
        """
        question_data = {
            "text": "Какие есть курсы?",
            "answers": [
                {"text": "Машинист", "correct": True},
                {"text": "Летчик", "correct": False}
            ]
        }
        serializer = Question(data=question_data)
        self.assertTrue(serializer.is_valid())
        question = serializer.save()

        # Проверка, что вопрос и ответы созданы
        self.assertEqual(question.text, "Какие есть курсы?")
        self.assertEqual(question.answers.count(), 2)

        answer_texts = [answer.text for answer in question.answers.all()]
        self.assertIn("Машинист", answer_texts)
        self.assertIn("Летчик", answer_texts)


# class CourseModelTest(TestCase):
    # def setUp(self):
    #     self.profession = Profession.objects.create(name="Test Profession")
    #     self.experience = WorkExperience.objects.create(name="Test Experience")
    #     self.scorm = SCORM.objects.create(name="Test SCORM", version="1.2")
    #     self.course = Course.objects.create(name="Test Course", decription="Test Course Description",
    #                                        beginer=True, profession=self.profession, scorm=self.scorm)
    #     self.course.experiences.add(self.experience)
    #
    # def test_course_creation(self):
    #     """Проверяем создание курса"""
    #     self.assertEqual(self.course.name, "Test Course")
    #     self.assertEqual(self.course.description, "Test Course Description")
    #     self.assertTrue(self.course.beginer)
    #     self.assertEqual(self.course.profession, self.profession)
    #     self.assertEqual(self.course.scorm, self.scorm)
    #     self.assertTrue(self.course.experiences.filter(pk=self.experience.pk).exists())
    #
    # def test_str_representation(self):
    #     """Тест строкового представления модели"""
    #     self.assertEqual(str(self.course), "Пример курса")
    #
    # def test_absolute_url(self):
    #     """Тест метода get_absolute_url"""
    #     expected_url = reverse('course-detail', kwargs={'pk': self.course.pk})
    #     self.assertEqual(self.course.get_absolute_url(), expected_url)