import json

from datetime import datetime

from loguru import logger

from django.conf import settings

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

    TASK = settings.LESSON_SWITCH_STATUS

    def __init__(self,
                 date: datetime,
                 lesson_id: int,
                 ):
        super().__init__(date=date)
        self.lesson_id = int(lesson_id)

    def _unique_name(self,
                     lesson_id: int,
                     ) -> str:
        """
        Получение уникального имени
        """
        time_cast = self._time_to_UNIX()
        logger.debug(f'set timecast {time_cast}')
        unique_name = f'Lesson_{lesson_id}_{time_cast}'
        logger.debug(f'unique name {unique_name}')
        return unique_name

    def _updated_settings(self, **kwargs):
        unique_name = self._unique_name(
            lesson_id=self.lesson_id,
            date=self.date,
            started=self.started,
        )
        set_kwargs = json.dumps(dict(
            lesson_id=self.lesson_id,
            ))
        self.update_settings(unique_name=unique_name,
                             kwargs=set_kwargs,
                             **kwargs,
                             )


class TaskManagerTestBlockSwitch(BaseTaskManager):
    """
    Созданиие таски для изменения статуса
    """

    TASK = settings.TESTBLOCK_SWITCH_STATUS

    def __init__(self,
                 date: datetime,
                 test_block_id: int,
                 ):
        super().__init__(date=date)
        self.test_block_id = int(test_block_id)

    def _unique_name(self,
                     test_block_id: int,
                     ) -> str:
        """
        Получение уникального имени
        """
        time_cast = self._time_to_UNIX()
        logger.debug(f'set timecast {time_cast}')
        unique_name = f'TestBlock_{test_block_id}_{time_cast}'
        logger.debug(f'unique name {unique_name}')
        return unique_name

    def _updated_settings(self, **kwargs):
        unique_name = self._unique_name(
            test_block_id=self.test_block_id,
            date=self.date,
        )
        set_kwargs = json.dumps(dict(
            test_block_id=self.test_block_id,
            ))
        self.update_settings(unique_name=unique_name,
                             kwargs=set_kwargs,
                             **kwargs,
                             )


class TaskManagerSendMain(BaseTaskManager):
    """
    Созданиие таски для отправки email
    """

    TASK = settings.SEND_MAIL_TASK

    def __init__(self,
                 date: datetime,
                 users: list,
                 course_id: int,
                 lesson_id: int,
                 ):
        super().__init__(date=date)
        self.test_block_id = int(test_block_id)

    def _unique_name(self,
                     test_block_id: int,
                     ) -> str:
        """
        Получение уникального имени
        """
        time_cast = self._time_to_UNIX()
        logger.debug(f'set timecast {time_cast}')
        unique_name = f'EmailSend_{test_block_id}_{time_cast}'
        logger.debug(f'unique name {unique_name}')
        return unique_name

    def _updated_settings(self, **kwargs):
        unique_name = self._unique_name(
            test_block_id=self.test_block_id,
            date=self.date,
        )
        set_kwargs = json.dumps(dict(
            test_block_id=self.test_block_id,
            ))
        self.update_settings(unique_name=unique_name,
                             kwargs=set_kwargs,
                             **kwargs,
                             )
