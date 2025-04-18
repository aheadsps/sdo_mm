from typing import ClassVar
from datetime import datetime

from django_celery_beat.models import ClockedSchedule

from .abc import AbstractTaskManager
from .exceptions import DateTimeTypeError
from lessons.utils import UTCTimeCast


class BaseTaskManager(AbstractTaskManager):
    """
    Базовый Task Manager с необходимой функциональностью
    """

    TASK: ClassVar[str | None] = None

    def __init__(self,
                 date: datetime,
                 ):
        if not isinstance(date, datetime):
            raise DateTimeTypeError(f'{date} не является типом datetime')
        self.date = date
        self.schedule = self._clocked_schedule(date)

    def _time_to_UNIX(self):
        time_cast = (UTCTimeCast(input_time=self.date)
                     .get_microseconds_off_UTC_time())
        return time_cast

    def _clocked_schedule(self, data_clocked):
        """
        Назначаем шедулер или берем старый если есть
        """
        schedule, _ = ClockedSchedule._default_manager.get_or_create(
            clocked_time=data_clocked
        )
        return schedule

    def create(self):
        return super().create()

    def update(self):
        return super().update()

    def delete(self):
        return super().delete()
