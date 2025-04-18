import json

from loguru import logger

from django.conf import settings
from django_celery_beat.models import PeriodicTask

from .base import BaseTaskManager
from .exceptions import TaskDoNotExists


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

    def _updated_settings(self, **kwargs):

        unique_name = self._unique_name(
            event_id=self.event_id,
            date=self.date,
            started=self.started,
        )
        set_kwargs = json.dumps(dict(
            event_id=self.event_id,
            started=self.started,
            ))
        self.update_settings(unique_name=unique_name,
                             kwargs=set_kwargs,
                             **kwargs,
                             )

    def bulk_create(self) -> PeriodicTask:
        """
        Создает экземпляр PeriodicTask для дальнейшего сохранения
        """
        self._updated_settings()
        return PeriodicTask(**self.settings)

    def create(self) -> PeriodicTask:
        """
        Создание задач для изменения статуса
        """
        self._updated_settings()
        task = PeriodicTask._default_manager.create(**self.settings)
        return task

    def update(self, **kwargs):
        """
        Обновление задачи
        """
        self._updated_settings()
        task = PeriodicTask._default_manager.filter(**self.settings)
        if not task.exists():
            raise TaskDoNotExists(f'Задачи с настройками {self.settings} не существует')
        self._updated_settings(**kwargs)
        task = task.get()
        task(**self.settings)
        task.save()
        task.refresh_from_db()
        return task