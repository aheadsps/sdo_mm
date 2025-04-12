import datetime

from django.utils import timezone

from loguru import logger

from lessons import exceptions
from lessons.utils import get_value, tigger_to_check
from lessons.models import SCORM, Lesson, Event


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


class BeginnerValidator:
    """
    Валидатор на проверку начального курса
    """

    requires_context = True

    def __init__(self, course: str, start_date: str, end_date: str) -> None:
        self.course = str(course)
        self.start_date = str(start_date)
        self.end_date = str(end_date)
        self.error_detail = dict()

    def _check(
        self,
        course: bool,
        start_date: datetime.datetime,
        end_date: datetime.datetime,
    ) -> None:
        """
        Проверка исключения временных рамок с статусом 'начинающий'
        """
        beginner = course.beginner
        if start_date and beginner:
            self.error_detail.update(dict(start_date='У курса для '
                                          'начинающих не может быть start_date'),
                                     )
        if end_date and beginner:
            self.error_detail.update(dict(start_date='У курса для '
                                          'начинающих не может быть end_date'),
                                     )
        self._process_error(error_detail=self.error_detail)

    def _process_error(self, error_detail: dict[str, str]) -> None:
        if error_detail:
            raise exceptions.UnprocessableEntityError(
                error_detail,
            )

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.start_date, self.end_date, self.course)
        if need_check:
            course = get_value(self.course, attrs, serializer)
            start_date = get_value(self.start_date, attrs, serializer)
            end_date = get_value(self.end_date, attrs, serializer)
            self._check(
                course=course,
                start_date=start_date,
                end_date=end_date,
            )


class IntervalValidator:
    """
    Валидатор на проверку интервала
    """

    requires_context = True

    def __init__(self, beginner: str, interval: str) -> None:
        self.beginner = str(beginner)
        self.interval = str(interval)

    def _check(
        self,
        beginner: bool,
        interval: datetime.timedelta,
    ) -> None:
        """
        Проверка исключения интервала при начинающем курсе
        """
        if interval and beginner:
            self.error_detail.update(dict(interval='Курс для начинающих не может иметь интервал'),
                                     )
        self._process_error(error_detail=self.error_detail)

    def _process_error(self, error_detail: dict[str, str]) -> None:
        if error_detail:
            raise exceptions.UnprocessableEntityError(
                error_detail,
            )

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.beginner, self.interval)
        if need_check:
            beginner = get_value(self.beginner, attrs, serializer)
            interval = get_value(self.interval, attrs, serializer)
            self._check(
                beginner=beginner,
                interval=interval,
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


class SingleEventValidator:
    """
    Валидатор на проверку единного эвента
    """

    requires_context = True

    def __init__(self, course: str) -> None:
        self.course = str(course)
        self.error_detail = dict()

    def _check(
        self,
        course,
    ) -> None:
        if Event._default_manager.filter(course=course).exists():
            self.error_detail.update(
                course='Не возможно запустить один и тот же курс дважды'
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
            self._check(course)


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
