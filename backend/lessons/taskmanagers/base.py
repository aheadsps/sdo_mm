from .abc import AbstractTaskManager
from typing import ClassVar
from datetime import datetime


from django_celery_beat.models import ClockedSchedule


class BaseTaskManager(AbstractTaskManager):
    """
    Базовый Task Manager с необходимой функциональностью
    """

    TASK: ClassVar[str | None] = None

    def __init__(self,
                 date: datetime,
                 ):
        self.date = date
        self.schedule = self._clocked_schedule(date)

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
