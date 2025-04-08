from rest_framework.validators import ValidationError


class UserStoryValidator:
    """Валидатор для модели UserStory"""
    def __init__(self, answer=None, test_block=None):
        self.answer = answer
        self.test_block = test_block

    def __call__(self):
        self._validate_answer()
        self._validate_test_block()

    def _validate_answer(self):
        if self.answer is not None and not hasattr(self.answer, 'question'):
            raise ValidationError("Ответ должен быть связан с вопросом")

    def _validate_test_block(self):
        if self.test_block is not None and not hasattr(self.test_block,
                                                       'lesson'):
            raise ValidationError("Тест должен быть связан с уроком")


class LessonStoryValidator:
    """
    Валидатор для модели LessonStory
    """

    def __init__(self, course=None, lesson=None):
        self.course = course
        self.lesson = lesson

    def __call__(self):
        self._validate_lesson_have_course()

    def _validate_lesson_have_course(self):
        if self.lesson.course != self.course:
            raise ValidationError("Урок не принадлежит указанному курсу")
