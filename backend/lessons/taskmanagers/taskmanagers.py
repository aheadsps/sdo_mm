import json

from datetime import datetime

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
                 date: datetime,
                 event_id: int,
                 started: bool,
                 ):
        super().__init__(date=date)
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
        """
        Обновление настроек по верх стандартных
        """
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



class TaskManagerLessonSwitch(BaseTaskManager):
    """
    Созданиие таски для изменения статуса
    """

    TASK = settings.EVENT_SWITCH_STATUS

    def __init__(self,
                 date: datetime,
                 lesson_id: int,
                 ):
        super().__init__(date=date)
        self.lesson_id = int(lesson_id)

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
