import datetime
import math

from loguru import logger

from django.utils import timezone
from django.db.models import Q

from lessons import exceptions
from lessons.utils import get_value, tigger_to_check
from lessons.models import (
    Lesson,
    Event,
    EventCovered,
    Course,
    Step,
    )
from users.models import WorkExperience


class TimeValidator:
    """
    Валидатор на проверку времени (не меньше текущего)
    """

    requires_context = True

    def __init__(self, start_date: str) -> None:
        self.start_date = str(start_date)
        self.error_detail = dict()
        self.valid_start = valid_start
    def _check_up_time(
        self,
        start_date: datetime.datetime,
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
        if time_now > start_date:
            self.error_detail.update(
                dict(start_date="Не может быть указано задним числом")
            )
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.start_date)
        if need_check:
            start_date = get_value(self.start_date, attrs, serializer)
            self._check_up_time(
                start_date=start_date,
            )


class PassRegistationsValidator:
    """
    Валидатор на пропуск регистрации
    """

    requires_context = True

    def __init__(self, event: str, user: str) -> None:
        self.event = str(event)
        self.user = str(user)
        self.error_detail = dict()

    def _check(
        self,
        event,
        user,
        curr_user,
    ) -> None:
        """
        Проверка исключения временных рамок с статусом 'начинающий'
        """
        if (not curr_user.is_staff and not curr_user.is_superuser) and user != curr_user:
            self.error_detail.update(dict(
                user='Регистрация доступна только для себя'
            ))
        if user.is_staff or user.is_superuser:
            self.error_detail.update(dict(
                user='Администратор и Учитель не могут зарегистрироваться'
            ))
        course_profession = event.course.profession
        experiences = event.course.experiences.get_queryset()
        logger.debug(f'validator check pass registations recieve user {user}')
        if course_profession:
            if not user.profession == course_profession:
                self.error_detail.update(dict(
                    profession='Возможно зарегистрироваться только на курс подходящей профессии'
                ))
        if experiences:
            time_now = timezone.now()
            date_now = datetime.date(year=time_now.year, month=time_now.month, day=time_now.day)
            experience_years = math.floor((date_now - user.date_commencement).days / 365)
            experience = WorkExperience._default_manager.get_or_create(years=experience_years)[0]
            logger.debug(f'validator check experience {experience} search is {experiences}')
            if experience not in experiences:
                self.error_detail.update(
                    dict(status='Возможно зарегистрироваться только на курс подходящего стажа'),
                    )
        logger.debug(f'event status is {event.status}')
        if not event.status == 'expected':
            self.error_detail.update(
                dict(status='Регистрация не возможна если курс уже начался или закончен'),
                )
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.event, self.user)
        if need_check:
            event = get_value(self.event, attrs, serializer)
            user = get_value(self.user, attrs, serializer)
            self._check(
                event=event,
                user=user,
                curr_user=serializer.context['request'].user,
            )


class StatusPassValidator:
    """
    Валидатор на пропуск при определенном статусе
    """

    requires_context = True

    def __init__(self,
                 course: str,
                 start_date: str,
                 status: str,
                 ) -> None:
        self.course = str(course)
        self.start_date = str(start_date)
        self.status = str(status)
        self.error_detail = dict()

    def _check(
        self,
        instance,
        course,
        start_date,
        status,
    ) -> None:
        """
        Проверка комбинации различных условий
        """
        if status == 'finished':
            self.error_detail.update(dict(status='Завершенный эвент нельзя изменять'))
        if instance.course != course:
            self.error_detail.update(dict(course='В установленном эвенте менять курс нельзя'))
        if status == 'started' and start_date != instance.start_date:
            self.error_detail.update(dict(course='Дата начала курса не может быть изменена при запущеном курсе'))
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs,
                                     self.course,
                                     self.start_date,
                                     self.end_date,
                                     self.status,
                                     )
        if need_check:
            course = get_value(self.course, attrs, serializer)
            start_date = get_value(self.start_date, attrs, serializer)
            status = get_value(self.status, attrs, serializer)
            self._check(
                instance=serializer.instance,
                course=course,
                start_date=start_date,
                status=status,
            )


class BeginnerValidator:
    """
    Валидатор на проверку начального курса
    """

    requires_context = True

    def __init__(self, course: str, start_date: str) -> None:
        self.course = str(course)
        self.start_date = str(start_date)
        self.error_detail = dict()

    def _check(
        self,
        course: int,
        start_date: datetime.datetime,
    ) -> None:
        """
        Проверка исключения временных рамок с статусом 'начинающий'
        """
        if isinstance(course, int):
            course = Course._default_manager.get(pk=course)
        beginner = course.beginner
        if start_date and beginner:
            self.error_detail.update(dict(start_date='У курса для '
                                          'начинающих не может быть start_date'),
                                     )
        if not start_date and not beginner:
            self.error_detail.update(dict(start_date='Необходимо указать дату начала'))
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.start_date, self.course)
        if need_check:
            course = get_value(self.course, attrs, serializer)
            start_date = get_value(self.start_date, attrs, serializer)
            self._check(
                course=course,
                start_date=start_date,
            )


class StatusEditValidator:
    """
    Валидатор на проверку Edit
    """

    requires_context = True

    def __init__(self, course: str) -> None:
        self.course = str(course)
        self.error_detail = dict()

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.course)
        if need_check:
            course = get_value(self.course, attrs, serializer)
            if course.status == 'edit':
                self.error_detail.update(dict(
                    status='Курс черновом варианте, зайдите в редактирование и обновите его'
                ))
            process_error(error_detail=self.error_detail)


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
        process_error(error_detail=self.error_detail)

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


class RegistrationValidator:
    """
    Валидатор на регистрацию
    """

    requires_context = True

    def __init__(self, user: str, event: str) -> None:
        self.user = str(user)
        self.event = str(event)

    def _check(
        self,
        user,
        event: Event,
    ) -> None:
        """
        Проверка исключения интервала при начинающем курсе
        """
        if EventCovered._default_manager.filter(Q(user=user) & Q(event=event)).exists():
            self.error_detail.update(dict(event='Не возможно повторно зарегистрироваться'),
                                     )
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.user, self.event)
        if need_check:
            user = get_value(self.user, attrs, serializer)
            event = get_value(self.event, attrs, serializer)
            self._check(
                user=user,
                event=event,
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
        process_error(error_detail=self.error_detail)

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
        if Event._default_manager.filter(course_id=course).exists():
            self.error_detail.update(
                course='Не возможно запустить один и тот же курс дважды'
            )
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.course)
        if need_check:
            course = get_value(self.course, attrs, serializer)
            self._check(course)


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
        if course.is_scorm:
            self.error_detail.update(
                course='Не возможно присвоить урок курсу, который имеет SCORM пакет'
            )
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.course)
        if need_check:
            course = get_value(self.course, attrs, serializer)
            self._check_scorm_pass(course)


class StepSerialValidator:
    """
    Валидатор номера шага
    """

    requires_context = True

    def __init__(self, serial: str, lesson) -> None:
        self.serial = str(serial)
        self.lesson = str(lesson)
        self.error_detail = dict()

    def _check(
        self,
        serial,
        lesson,
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if isinstance(lesson, int):
            lesson = Lesson._default_manager.get(pk=lesson)
        if Step._default_manager.filter(Q(serial=serial) & Q(lesson=lesson)).exists():
            self.error_detail.update(dict(serial='Данный номер уже присутствует в уроке'))
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.serial, self.lesson)
        if need_check:
            serial = get_value(self.serial, attrs, serializer)
            lesson = get_value(self.lesson, attrs, serializer)
            self._check(serial, lesson)


class LessonSerialValidator:
    """
    Валидатор номера шага
    """

    requires_context = True

    def __init__(self, serial: str, course) -> None:
        self.serial = str(serial)
        self.course = str(course)
        self.error_detail = dict()

    def _check(
        self,
        serial,
        course,
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if isinstance(course, int):
            course = Course._default_manager.get(pk=course)
        if Lesson._default_manager.filter(Q(serial=serial) & Q(course=course)).exists():
            self.error_detail.update(dict(serial='Данный номер уже присутствует в курсе'))
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.serial, self.course)
        if need_check:
            serial = get_value(self.serial, attrs, serializer)
            course = get_value(self.course, attrs, serializer)
            self._check(serial, course)


class EmptyLessonsValidator:
    """
    Валидатор курса без уроков
    """

    requires_context = True

    def __init__(self, course: str) -> None:
        self.course = str(course)
        self.error_detail = dict()

    def _check(
        self,
        course,
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if isinstance(course, int):
            course = Course._default_manager.get(pk=course)
        if not course.lessons.exists() and not course.scorms.exists():
            self.error_detail.update(dict(serial='Нельзя запустить курс без уроков'))
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.course)
        if need_check:
            course = get_value(self.course, attrs, serializer)
            self._check(course)


class DateRequiredValidator:
    """
    Валидатор курса без start date
    """

    requires_context = True

    def __init__(self, course: str, start_date: str) -> None:
        self.course = str(course)
        self.start_date = str(start_date)
        self.error_detail = dict()

    def _check(
        self,
        course,
        start_date,
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if isinstance(course, int):
            course = Course._default_manager.get(pk=course)
        if not course.beginner and not start_date:
            self.error_detail.update(dict(start_date='Необходимо указать дату начала курса'))
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.course, self.start_date)
        if need_check:
            course = get_value(self.course, attrs, serializer)
            start_date = get_value(self.start_date, attrs, serializer)
            self._check(course, start_date)


class AttachmentValidator:
    """
    Валидатор вложений
    """

    requires_context = True

    def __init__(self, materials: str, step: str) -> None:
        self.materials = str(materials)
        self.step = str(step)
        self.error_detail = dict()

    def _check(
        self,
        materials,
        step,
    ) -> None:
        """
        Проверка возможности присвоения SCORM пакета
        """
        if materials and step:
            self.error_detail.update(dict(materials='Необходимо выбрать или step или course'))
            self.error_detail.update(dict(step='Необходимо выбрать или step или course'))
        process_error(error_detail=self.error_detail)

    def __call__(self, attrs, serializer):
        self.error_detail = dict()
        need_check = tigger_to_check(attrs, self.materials, self.step)
        if need_check:
            materials = get_value(self.materials, attrs, serializer)
            step = get_value(self.step, attrs, serializer)
            self._check(materials, step)


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


def process_error(error_detail: dict[str, str]) -> None:
    if error_detail:
        raise exceptions.UnprocessableEntityError(
            error_detail,
        )
