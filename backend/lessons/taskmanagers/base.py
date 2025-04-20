from typing import ClassVar
from datetime import datetime

from loguru import logger

from django_celery_beat.models import ClockedSchedule, PeriodicTask
from django.conf import settings

from .abc import AbstractTaskManager
from .exceptions import (DateTimeTypeError,
                         TaskDoNotExists,
                         UpdateSettingsNotSet,
                         )
from lessons.utils import UTCTimeCast


class BaseTaskManager(AbstractTaskManager):
    """
    Базовый Task Manager с необходимой функциональностью
    """

    TASK: ClassVar[str | None] = None
    _one_of: ClassVar[bool] = True
    _expire_seconds: ClassVar[int] = settings.CELERY_EXPIRE_SECONDS

    def __init__(self,
                 date: datetime,
                 ):
        if not isinstance(date, datetime):
            raise DateTimeTypeError(f'{date} не является типом datetime')
        self.date = date
        self.schedule = self._clocked_schedule(date)
        self._settings = self._get_settings()

    @property
    def settings(self):
        return self._settings

    def _get_settings(self) -> dict[str, int | bool | str | datetime]:
        settings = dict(
            task=self.TASK,
            expire_seconds=self._expire_seconds,
            one_off=self._one_of,
            start_time=self.date,
        )
        return settings

    def update_settings(self, **kwargs):
        self._settings = self._settings | kwargs

    def _get_task(self) -> PeriodicTask:
        self._updated_settings()
        task = PeriodicTask._default_manager.filter(**self.settings)
        if not task.exists():
            raise TaskDoNotExists(f'Задачи с настройками {self.settings} не существует')
        return task.get()

    def _time_to_UNIX(self):
        time_cast = (UTCTimeCast(input_time=self.date)
                     .get_microseconds_off_UTC_time())
        return time_cast

    def _updated_settings(self, **kwargs):
        """
        Переопределение настроек для стандарных settings
        Обязательно для переопределения
        """
        raise UpdateSettingsNotSet('Необходимо установить логику переопределения настроек')

    def _clocked_schedule(self, data_clocked):
        """
        Назначаем шедулер или берем старый если есть
        """
        schedule, _ = ClockedSchedule._default_manager.get_or_create(
            clocked_time=data_clocked
        )
        return schedule

    def bulk_create(self) -> PeriodicTask:
        """
        Создает экземпляр PeriodicTask для дальнейшего сохранения
        """
        self._updated_settings()
        logger.debug(f'settings \n{self.settings}')
        return PeriodicTask(**self.settings)

    def create(self) -> PeriodicTask:
        """
        Создание задач для изменения статуса
        """
        self._updated_settings()
        task = PeriodicTask._default_manager.create(**self.settings)
        return task

    def update(self, **kwargs) -> PeriodicTask:
        """
        Обновление задачи
        """
        task = self._get_task()
        self._updated_settings(**kwargs)
        task(**self.settings)
        task.save()
        task.refresh_from_db()
        return task

    def bulk_update(self, **kwargs) -> PeriodicTask:
        """
        Обновление задачи без сохранения
        """
        task = self._get_task()
        self._updated_settings(**kwargs)
        return task(**self.settings)

    def delete(self) -> None:
        task = self._get_task()
        logger.warning(f'get task to delete {task}')
        task.delete()
