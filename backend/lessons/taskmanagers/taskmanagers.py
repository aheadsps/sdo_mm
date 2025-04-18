from loguru import logger

from django.conf import settings
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

    def create(self):
        """Создание задач для изменения статуса
        """
        unique_name = self._unique_name(
            event_id=self.event_id,
            date=self.date,
            started=self.started,
        )
