import json

from loguru import logger

from django.conf import settings
from django_celery_beat.models import PeriodicTask

from .base import BaseTaskManager


class TaskManagerEventSwitch(BaseTaskManager):
    """
    Созданиие таски для изменения статуса
    """

    TASK = settings.EVENT_SWITCH_STATUS

    def __init__(self,
                 event_id: int,
                 started: bool,
                 ):
        self.event_id = int(event_id)
        self.started = bool(started)

    def _unique_name(self,
                     event_id: int,
                     started: bool,
                     ) -> str:
        """
        Получение уникального имени
        """
        status = 'start' if started else 'finished'
        time_cast = self._time_to_UNIX()
        logger.debug(f'set timecast {time_cast}')
        unique_name = f'Event_{event_id}_{status}_{time_cast}'
        logger.debug(f'unique name {unique_name}')
        return unique_name

    def _updated_settings(self,
                          unique_name: str,
                          kwargs: str,
                          ):
        settings = self.get_settings_task()
        settings['name'] = unique_name
        settings['kwargs'] = kwargs
        return settings

    def bulk_create(self) -> PeriodicTask:
        """
        Создает экземпляр PeriodicTask для дальнейшего сохранения
        """
        unique_name = self._unique_name(
            event_id=self.event_id,
            date=self.date,
            started=self.started,
        )
        kwargs = json.dumps(dict(
            event_id=self.event_id,
            started=self.started,
            ))
        settings = self._updated_settings(
            unique_name=unique_name,
            kwargs=kwargs,
        )
        return PeriodicTask(**settings)

    def create(self) -> PeriodicTask:
        """
        Создание задач для изменения статуса
        """
        unique_name = self._unique_name(
            event_id=self.event_id,
            date=self.date,
            started=self.started,
        )
        kwargs = json.dumps(dict(
            event_id=self.event_id,
            started=self.started,
            ))
        settings = self._updated_settings(
            unique_name=unique_name,
            kwargs=kwargs,
        )
        task = PeriodicTask._default_manager.create(**settings)
        return task
