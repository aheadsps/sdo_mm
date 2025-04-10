import datetime

from django.utils import timezone
from loguru import logger

from lessons import exceptions
from lessons.utils import get_value, tigger_to_check


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

        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d %H:%M")
        start_date = timezone.make_aware(start_date)

        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d %H:%M")
        end_date = timezone.make_aware(end_date)

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


class BadDataEventValidator:
    """
    Валидатор на проверку наличия полей course и users
    """

    requires_context = True

    def __init__(self, course: str, users: str) -> None:
        self.course = course
        self.users = users

    def __call__(self, attrs, serializer_field):
        """
        Проверка наличия полей course и users
        """
        need_check = tigger_to_check(attrs, self.serial)
        if need_check:
            try:
                self.course = int(self.course)
            except:
                raise exceptions.UnprocessableEntityError(
                    dict(serial="Нет 'course' или не число")
                )
            if int(self.course) < 1:
                raise exceptions.UnprocessableEntityError(
                    dict(serial="'course' не может быть меньше 1")
                )
        if len(self.users) == 0:
            raise exceptions.UnprocessableEntityError(
                dict(serial="Нет 'users'")
            )
        for user in self.users:
            try:
                user = int(user)
            except:
                raise exceptions.UnprocessableEntityError(
                    dict(serial="Нет 'user' или не число")
                )

