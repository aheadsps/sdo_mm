import json
from typing import Literal

from datetime import datetime

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
        unique_name = f'Event_{event_id}_{status}_{time_cast}'
        return unique_name

    def _updated_settings(self, **kwargs):
        """
        Обновление настроек по верх стандартных
        """
        unique_name = self._unique_name(
            event_id=self.event_id,
            started=self.started,
        )
        set_kwargs = json.dumps(dict(
            event_id=self.event_id,
            started=self.started,
            ))
        self.update_settings(name=unique_name,
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
                 started: bool,
                 ):
        super().__init__(date=date)
        self.lesson_id = int(lesson_id)
        self.started = bool(started)

    def _unique_name(self,
                     lesson_id: int,
                     started: bool,
                     ) -> str:
        """
        Получение уникального имени
        """
        status = 'start' if started else 'finished'
        time_cast = self._time_to_UNIX()
        unique_name = f'Lesson_{lesson_id}_{status}_{time_cast}'
        return unique_name

    def _updated_settings(self, **kwargs):
        unique_name = self._unique_name(
            lesson_id=self.lesson_id,
            started=self.started,
        )
        set_kwargs = json.dumps(dict(
            lesson_id=self.lesson_id,
            started=self.started,
            ))
        self.update_settings(name=unique_name,
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
        unique_name = f'TestBlock_{test_block_id}_{time_cast}'
        return unique_name

    def _updated_settings(self, **kwargs):
        unique_name = self._unique_name(
            test_block_id=self.test_block_id,
        )
        set_kwargs = json.dumps(dict(
            test_block_id=self.test_block_id,
            ))
        self.update_settings(name=unique_name,
                             kwargs=set_kwargs,
                             **kwargs,
                             )


class TaskManagerSendMail(BaseTaskManager):
    """
    Созданиие таски для отправки email
    """

    TASK = settings.SEND_MAIL_TASK

    def __init__(self,
                 date: datetime,
                 course_id: int | None,
                 ids_users: list[int],
                 template: str | None,
                 type_content: Literal['Курс', 'Урок'] = 'Курс',
                 ):
        super().__init__(date=date)
        self.course_id = int(course_id)
        self.ids_users = ids_users
        self.template = template
        self.type_content = str(type_content)

    def _unique_name(self,
                     type_content: str,
                     course_id: int,
                     ) -> str:
        """
        Получение уникального имени
        """
        time_cast = self._time_to_UNIX()
        unique_name = f'EmailSend_{course_id}_{type_content}_{time_cast}'
        return unique_name

    def _updated_settings(self, **kwargs):
        unique_name = self._unique_name(
            type_content=self.type_content,
            course_id=self.course_id,
        )
        set_kwargs = json.dumps(dict(
            course=self.course_id,
            users=self.ids_users,
            type_content=self.type_content,
            template=self.template,
            ))
        self.update_settings(name=unique_name,
                             kwargs=set_kwargs,
                             **kwargs,
                             )
