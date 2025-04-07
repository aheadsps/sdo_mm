import datetime
from pathlib import Path

from django.core.exceptions import ValidationError
from django.utils import timezone
from django.conf import settings
from loguru import logger

from lessons import exceptions
from lessons.utils import get_value, tigger_to_check


def validate_path(value: str):
    logger.debug(value)
    media = Path(settings.MEDIA_ROOT)
    fp = media.joinpath('scorm', value)
    if fp.exists():
        raise ValidationError(
            'Курс с данным именем уже имеется',
            code='course_exists',
            params={"value": value},
            )


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
        logger.debug(f'dates in validator \nstart_date:{start_date} \nend_date: {end_date} \ntime_now: {time_now}')
        if start_date and (time_now > start_date):
            logger.debug(f'enter to error start_date {start_date and (time_now > start_date)}')
            self.error_detail.update(
                dict(start_date="Не может быть указано задним числом")
            )
        if end_date and (time_now > end_date):
            logger.debug(f'enter to error end_date {end_date and (time_now > end_date)}')
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


class StepScormValidator:
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
        if instance.steps:
            self.error_detail.update(
                'Не возможно присвоить SCORM пакет к уроку который имеет шаги'
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


class LessonScormValidator:
    """
    Валидатор на проверку возможности сохранения SCORM
    """

    requires_context = True

    def __init__(self, lesson: str) -> None:
        self.lesson = str(lesson)
        self.error_detail = dict()

    def _check_scorm_pass(
        self,
        lesson
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if lesson.scorm:
            self.error_detail.update(
                'Не возможно присвоить шаг уроку который имеет SCORM пакет'
            )
        self._process_error(error_detail=self.error_detail)

    def _process_error(self, error_detail: dict[str, str]) -> None:
        if error_detail:
            raise exceptions.UnprocessableEntityError(
                error_detail,
            )

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.lesson)
        if need_check:
            lesson = get_value(self.lesson, attrs, serializer)
            self._check_scorm_pass(lesson)


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
