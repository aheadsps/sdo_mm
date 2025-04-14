import json
from lessons import models
from celery.local import Proxy

from django_celery_beat.models import PeriodicTask, ClockedSchedule
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.db.models import Q
from datetime import datetime
from lessons import tasks


class TaskManager:
    """
    Вместе с создание Эвента
    составление clocked_time задачи
    по переводу евента в статус "в процессе"
    и обратному переводу в статусы завершения
    Получает данные:
    id-course: int,
    дата-тайм начала (может null),
    дата-тайм финиша (может null)
    """
    def __init__(
        self,
        event_pk = None,
        course = None,
        data_start: str = None,
        data_end: str = None,
    ):
        self.event_pk = event_pk
        self.course = course
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


    def _add_task_update(self,
                         clocked: object,
                         name_task: str,
                         task: str,
                         kwargs: dict
                         ) -> None:
        """
        Установка задач
        """
        # Проверить есть ли таск для этого курса
        task_event = PeriodicTask._default_manager.filter(
            name=name_task
        ).first()
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
            kwargs_old["start_date"] = kwargs["start_date"]
            kwargs_old["end_date"] = kwargs["end_date"]
            task_event.kwargs = json.dumps(kwargs_old)
            task_event.clocked = clocked
            task_event.save()


    def _task_update_status_event(self, kwargs):
        """
        Запросы на установку задач по изменению статуса евента
        """
        task = "lessons.tasks.update_status_events"
        if self.schedule_start:
            clocked = self.schedule_start
            name = f"StartEvent_{kwargs['pk']}"
            kwargs['status'] = 'process'
            self._add_task_update(clocked, name, task, kwargs)
        if self.schedule_end:
            clocked = self.schedule_end
            kwargs['status'] = 'finished'
            name = f"EndEvent_{kwargs['pk']}"
            self._add_task_update(clocked, name, task, kwargs)


    def create(self):
        """
        Создать эвент. Создать задачи
        start_event на перевод по дате эвента в текущий и
        end_event его завершение
        """
        kwargs = {
            "course_id": self.course.pk,
            "end_date": TaskManager.date_str(self.data_end),
            "start_date": TaskManager.date_str(self.data_start),
            "pk": self.event_pk,
        }

        # если есть шедулера
        # ставим задачу на установку статуса на process
        # и задачу на установку статуса завершения

        self._task_update_status_event(kwargs)

        if not self.schedule_start:
            # ставим задачу на отправку писем
            tasks.send_mail_users.delay(**kwargs)

    def update(self):
        kwargs = {
            "end_date": TaskManager.date_str(self.data_end),
            "start_date": TaskManager.date_str(self.data_start),
            "pk": self.event_pk,
        }
        self._task_update_status_event(kwargs)