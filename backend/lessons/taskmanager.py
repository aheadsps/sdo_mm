import json

from typing import ClassVar

from celery.local import Proxy

from loguru import logger

from django_celery_beat.models import PeriodicTask, ClockedSchedule
from django.utils import timezone
from django.conf import settings
from datetime import datetime


from lessons import tasks


class TaskManager:
    """
    Вызывается с созданием объекта
    Вызывает задачу по времени clocked_time
    для переданного ID
    Получает данные:
    id объекта: int
    номер для идентификации задачи: int
    дата-тайм начала (может null),
    дата-тайм финиша (может null)
    """

    def __init__(
        self,
        event_pk: int = None,
        # number_task: int = None,
        data_start: str = None,
        data_end: str = None,
    ):
        self.event_pk = event_pk
        # self.number_task = number_task
        self.data_start = data_start
        self.data_end = data_end

        # Если есть даты делаем шедулеры
        if self.data_start:
            self.schedule_start = self._clocked_schedule(self.data_start)
        else:
            self.schedule_start = None
            self.data_start = timezone.now()
        if self.data_end:
            self.schedule_end = self._clocked_schedule(self.data_end)
        else:
            self.schedule_end = None

    def _clocked_schedule(self, data_clocked):
        """
        Назначаем шедулер или берем старый если есть
        """
        if data_clocked:
            schedule, _ = ClockedSchedule._default_manager.get_or_create(
                clocked_time=data_clocked
            )
            return schedule
        return None

    @staticmethod
    def date_str(dt: datetime):
        """
        Переводим datetime в строковой вид
        """
        if dt:
            return dt.strftime("%Y-%m-%d %H:%M")
        else:
            return None

    def _add_task_update(
        self, clocked: object, name_task: str, task: str, kwargs: dict
    ) -> None:
        """
        Установка задач
        """
        # Проверить есть ли таск для этого курса
        task_event = PeriodicTask._default_manager.filter(name=name_task).first()
        if not task_event:
            instance = PeriodicTask._default_manager.create(
                clocked=clocked,
                one_off=True,
                name=name_task,
                task=task,
                kwargs=json.dumps(kwargs),
            )
        else:
            # Если таск есть
            kwargs_old: dict = json.loads(task_event.kwargs)
            # kwargs_old["start_date"] = kwargs["start_date"]
            # kwargs_old["end_date"] = kwargs["end_date"]
            task_event.kwargs = json.dumps(kwargs_old)
            task_event.one_off = True
            task_event.clocked = clocked
            task_event.save()

    def _task_update_status_event(self, kwargs):
        """
        Запросы на установку задач по изменению статуса евента
        """
        task = kwargs.get("task")
        kwargs_for_task: dict = {
            "pk": kwargs["pk"],
            #'start_date': kwargs['start_date'],
            #'end_date': kwargs['end_date']
        }
        if self.schedule_start:
            clocked = self.schedule_start
            name = f"Start_{kwargs['name']}"
            kwargs_for_task["status"] = "process"
            self._add_task_update(clocked, name, task, kwargs_for_task)
        if self.schedule_end:
            clocked = self.schedule_end
            kwargs_for_task["status"] = "finished"
            name = f"End_{kwargs['name']}"
            self._add_task_update(clocked, name, task, kwargs_for_task)

    def create(self, kwargs):
        """
        Создать эвент. Создать задачи
        start_event на перевод по дате эвента в текущий и
        end_event его завершение
        """
        # если есть шедулера
        # ставим задачу на установку статуса на process
        # и задачу на установку статуса завершения

        self._task_update_status_event(kwargs)

        if not self.schedule_start:
            # ставим задачу на отправку писем
            tasks.send_mail_users.delay(**kwargs)

    def update(self, kwargs):
        self._task_update_status_event(kwargs)


class TaskManagerEvent(TaskManager):
    def create(self):
        """
        Метод для универсального класса Таксманаджер
        Меняет статусы в Эвентах
        """
        kwargs = {
            "name": f"Event_{self.event_pk}",
            "end_date": TaskManager.date_str(self.data_end),
            "start_date": TaskManager.date_str(self.data_start),
            "pk": self.event_pk,
            "task": "lessons.tasks.update_status_events",
        }
        super().create(kwargs)

    def update(self):
        kwargs = {
            "name": f"Event_{self.event_pk}",
            "end_date": TaskManager.date_str(self.data_end),
            "start_date": TaskManager.date_str(self.data_start),
            "pk": self.event_pk,
        }
        super().update(kwargs)
