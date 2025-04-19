import datetime

from django.core.exceptions import ValidationError
from django.db.models import Q
from django.utils import timezone

from loguru import logger

from lessons import exceptions
from lessons.utils import get_value, tigger_to_check
from lessons.models import SCORM, Lesson, Question


class TimeValidator:
    """
    Валидатор на проверку времени (не меньше текущего)
    """

    requires_context = True

    def __init__(self, start_date: str, end_date: str) -> None:
        self.start_date = str(start_date)
        self.end_date = str(end_date)
        self.error_detail = dict()

    def _check_up_time(
            self,
            start_date: datetime.datetime,
            end_date: datetime.datetime,
    ) -> None:
        """
        Проверка корректности временых рамок

        Args:
            start_date (datetime.datetime): Дата начала
            end_date (datetime.datetime): Дата конечная

        Raises:
            exceptions.UnprocessableEntityError: Исключение в случае не соотвествия
        """
        time_now = timezone.now()
        logger.debug(
            f'dates in validator \nstart_date:{start_date} \nend_date: {end_date} \ntime_now: {time_now}')
        if start_date and (time_now > start_date):
            logger.debug(
                f'enter to error start_date {start_date and (time_now > start_date)}')
            self.error_detail.update(
                dict(start_date="Не может быть указано задним числом")
            )
        if end_date and (time_now > end_date):
            logger.debug(
                f'enter to error end_date {end_date and (time_now > end_date)}')
            self.error_detail.update(
                dict(end_date="Не может быть указано задним числом")
            )
        if (start_date and end_date) and (start_date >= end_date):
            self.error_detail.update(
                dict(date="start_date не может быть позже чем end_date")
            )
        self._process_error(error_detail=self.error_detail)

    def _process_error(self, error_detail: dict[str, str]) -> None:
        if error_detail:
            raise exceptions.UnprocessableEntityError(
                error_detail,
            )

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.start_date, self.end_date)
        if need_check:
            start_date = get_value(self.start_date, attrs, serializer)
            end_date = get_value(self.end_date, attrs, serializer)
            self._check_up_time(
                start_date=start_date,
                end_date=end_date,
            )


class CourseScormValidator:
    """
    Валидатор на проверку возможности сохранения SCORM
    """

    requires_context = True

    def __init__(self, scorm: str) -> None:
        self.scorm = str(scorm)
        self.error_detail = dict()

    def _check_scorm_pass(
            self,
            instance
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if Lesson._default_manager.filter(course=instance).exists():
            self.error_detail.update(
                scorm='Не возможно присвоить SCORM пакет к курсу, который имеет уроки'
            )
        self._process_error(error_detail=self.error_detail)

    def _process_error(self, error_detail: dict[str, str]) -> None:
        if error_detail:
            raise exceptions.UnprocessableEntityError(
                error_detail,
            )

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.scorm)
        if need_check:
            scorm = get_value(self.scorm, attrs, serializer)
            if scorm and serializer.instance:
                self._check_scorm_pass(serializer.instance)


class SCORMUniqueValidator:
    """
    Валидатор на проверку уникальности SCORM
    """

    requires_context = True

    def __init__(self, name: str) -> None:
        self.name = str(name)
        self.error_detail = dict()

    def _check_scorm_pass(
            self,
            name,
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if SCORM._default_manager.filter(name=name).exists():
            self.error_detail.update(
                scorm='SCORM пакет с таким именем уже существует'
            )
        self._process_error(error_detail=self.error_detail)

    def _process_error(self, error_detail: dict[str, str]) -> None:
        if error_detail:
            raise exceptions.UnprocessableEntityError(
                error_detail,
            )

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.name)
        if need_check:
            name = get_value(self.name, attrs, serializer)
            self._check_scorm_pass(name)


class LessonScormValidator:
    """
    Валидатор на проверку возможности сохранения SCORM
    """

    requires_context = True

    def __init__(self, course: str) -> None:
        self.course = str(course)
        self.error_detail = dict()

    def _check_scorm_pass(
            self,
            course,
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if course.scorm:
            self.error_detail.update(
                course='Не возможно присвоить урок курсу, который имеет SCORM пакет'
            )
        self._process_error(error_detail=self.error_detail)

    def _process_error(self, error_detail: dict[str, str]) -> None:
        if error_detail:
            raise exceptions.UnprocessableEntityError(
                error_detail,
            )

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.course)
        if need_check:
            course = get_value(self.course, attrs, serializer)
            self._check_scorm_pass(course)


class MoreThanZeroValidator:
    """
    Валидатор на проверку нумерации int >= 1
    """

    requires_context = True

    def __init__(self, serial: str) -> None:
        self.serial = serial

    def __call__(self, attrs, serializer_field):
        """
        Проверка корректности serial >= 1
        """
        need_check = tigger_to_check(attrs, self.serial)
        if need_check:
            if int(serializer_field.initial_data.get(self.serial)) < 1:
                raise exceptions.UnprocessableEntityError(
                    dict(serial="Не может быть меньше 1")
                )


class QuestionTypeValidator:
    """
    Проверяет, что ответы можно добавлять только к вопросам типа "test"
    """
    requires_context = True

    def __init__(self, field):
        self.field = field

    def __call__(self, attrs, serializer):
        question = attrs.get(self.field)

        if question and question.type_question != "test":
            raise exceptions.UnprocessableEntityError({
                self.field: "Ответы можно прикреплять только к"
                            " вопросам типа 'test'"
            })


class TaskEssayQuestionValidator:
    """
    Проверяет что в блоке не более 1 вопроса типа task/essay.
    Нельзя добавить task/essay вопрос к блоку с таким вопросом
    """
    requires_context = True

    def __init__(self, test_block_field, question_type_field):
        self.test_block_field = test_block_field
        self.question_type_field = question_type_field

    def __call__(self, attrs, serializer):
        test_block = attrs.get(self.test_block_field)
        question_type = attrs.get(self.question_type_field)

        if not test_block or not question_type:
            return

        if question_type in ['task', 'essay']:
            exists = Question.objects.filter(
                Q(test_block=test_block) &
                Q(type_question__in=['task', 'essay'])
            ).exists()

            if exists:
                raise exceptions.ValidationError({
                    self.question_type_field:
                        "TestBlock может содержать только один вопрос типа"
                        " task или essay"
                })


class NoAnswerForTaskEssayValidator:
    """
    Проверяет что для вопросов типа task/essay нельзя прикреплять ответы
    """
    requires_context = True

    def __init__(self, answer_field):
        self.answer_field = answer_field

    def __call__(self, attrs, serializer):
        if self.answer_field not in attrs:
            return

        question = serializer.context.get('question')
        if question and question.type_question in ['task', 'essay']:
            raise exceptions.ValidationError({
                self.answer_field: "Нельзя прикреплять ответы к вопросам"
                                   " типа task или essay"
            })


class AssessmentScoreValidator:
    """
    Проверяет что оценка не превышает max_score и оценка ещё не была
    проставлена ранее
    """
    requires_context = True

    def __init__(self, score_field):
        self.score_field = score_field

    def __call__(self, attrs, serializer):
        if self.score_field not in attrs:
            return

        score = attrs[self.score_field]
        if score is None:
            return

        submission = serializer.instance
        test_block = attrs.get('test_block') or getattr(submission,
                                                        'test_block', None)
        if not test_block:
            return

        if score > test_block.max_score:
            raise exceptions.ValidationError({
                self.score_field: f'Оценка не может превышать максимальный'
                                  f' балл ({test_block.max_score})'
            })

        if submission and submission.score is not None:
            raise exceptions.ValidationError({
                self.score_field: 'Оценка уже была выставлена ранее'
            })
