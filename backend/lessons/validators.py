import datetime

from django.utils import timezone

from lessons.utils import get_value, tigger_to_check
from lessons import exceptions


class UpTimeValidator:
    """
    Валидатор на проверку времени (не меньше текущего)
    """

    requires_context = True

    def __init__(self, time: datetime.datetime) -> None:
        self.time = str(time)

    def _check_up_time(self, time: datetime.datetime) -> None:
        time_now = timezone.now()
        if time_now and time_now > time:
            raise exceptions.UnprocessableEntityError(
                dict(start_date='Не может быть указано задним числом'),
                )

    def __call__(self, attrs, serializer):
        need_check = tigger_to_check(attrs, self.time)
        if need_check:
            time = get_value(self.time, attrs, serializer)
            self._check_up_time(time=time)
