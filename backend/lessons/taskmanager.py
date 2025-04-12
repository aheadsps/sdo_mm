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
    id-course: int, список пользователей :str "1,2,3",
    дата-тайм начала, дата-тайм финиша (может null)
    """
    def __init__(
        self,
        course: int = None,
        user_list: list = None,
        data_start: str = None,
        data_end: str = None,
    ):
        self.course = int(course)
        self.data_start = data_start
        self.data_end = data_end
        # Users становится нормальным списком [1,2,3,...]
        self.user_list = [int(user) for user in user_list]
        # Если есть даты делаем шедулеры
        if self.data_start:
            self.data_start = datetime.strptime(self.data_start, "%Y-%m-%d %H:%M")
            self.data_start = timezone.make_aware(self.data_start)
            self.schedule_start = self._clocked_schedule(self.data_start)
        else:
            self.schedule_start = None
            self.data_start = timezone.now()
        if self.data_end:
            self.data_end = datetime.strptime(self.data_end, "%Y-%m-%d %H:%M")
            self.data_end = timezone.make_aware(self.data_end)
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
            # Если таск есть - Плюсуем пользователей в user_list
            kwargs: dict = json.loads(task_event.kwargs)
            users = set(kwargs.get('users')).union(set(self.user_list))
            kwargs["users"] = list(users)
            task_event.kwargs = json.dumps(kwargs)
            task_event.save()


    def _task_update_status_event(self, kwargs: dict) -> None:
        """
        если есть шедулера запуска
        ставим задачу на установку статуса на process
        и задачу на установку статуса завершения
        """
        name, clocked = '', None
        kwargs_for_process: dict = {
            "course_id": kwargs['course_id'],
            "users": kwargs['users'],
        }
        task = "lessons.tasks.update_events"
        # на изменение статуса "в процессе"
        if self.schedule_start:
            name = f"StartEvent_{self.course}_at_{kwargs.get('start_date')}"
            kwargs_for_process['status'] = 'process'
            kwargs_for_process['date_upload'] = kwargs['start_date']
            clocked = self.schedule_start
            self._add_task_update(clocked, name, task, kwargs_for_process)

        # на изменение статуса "в конец"
        if self.schedule_end:
            name = f"EndEvent_{self.course}_at_{kwargs.get('end_date')}"
            kwargs_for_process['status'] = 'end'
            kwargs_for_process['date_upload'] = kwargs['end_date']
            clocked = self.schedule_end
            self._add_task_update(clocked, name, task, kwargs_for_process)

        return None


    def create(self):
        """
        Создать эвент.
        Создать задачи на перевод по дате эвента
        в текущий и его завершение
        """
        # В kwargs передаем данные для вызова функции
        if self.schedule_start:
            status = 'expected'
        else:
            status = 'process'

        kwargs = {
            "course_id": self.course,
            "users": self.user_list,
            "end_date": TaskManager.date_str(self.data_end),
            "start_date": TaskManager.date_str(self.data_start),
            "status": status
        }
        # Events создаем сразу
        # или перезаписываем
        self.delete()
        instance = tasks.create_events.delay(**kwargs)

        # если есть шедулера запуска
        # ставим задачу на установку статуса на process
        # и задачу на установку статуса завершения
        self._task_update_status_event(kwargs)

        if not self.schedule_start:
            # ставим задачу на отправку писем
            tasks.send_mail_users.delay(**kwargs)


        return instance


    def delete(self) -> None:
        """
        Чистим таски от пользователей
        Нужно номер курса и список пользователей
        """
        # Чистим задачи от пользователей
        # Ищем уникальные start_date для списка пользователей
        events_old = (models.Event._default_manager.
                      filter(Q(course_id=self.course) & Q(user_id__in=self.user_list)).
                      values('start_date').distinct())
        # Удаляем пользователей из задач с такой датой
        for event_old in events_old:
            dt = timezone.localtime(event_old['start_date'])
            name = f"StartEvent_{self.course}_at_{dt.strftime('%Y-%m-%d %H:%M')}"
            tasks = (PeriodicTask._default_manager.filter(name=name))
            for task in tasks:
                # Если таск есть - Плюсуем пользователей в user_list
                kwargs: dict = json.loads(task.kwargs)
                users_old = set(kwargs.get('users')) - (set(self.user_list))
                kwargs["users"] = list(users_old)
                task.kwargs = json.dumps(kwargs)
                task.save()

        # Чистим задачи от пользователей
        # Ищем уникальные end_date для списка пользователей
        events_old = (models.Event._default_manager.
                      filter(Q(course_id=self.course) & Q(user_id__in=self.user_list)).
                      values('end_date').distinct())
        # Удаляем пользователей из задач с такой датой
        for event_old in events_old:
            dt = timezone.localtime(event_old['end_date'])
            name = f"EndEvent_{self.course}_at_{dt.strftime('%Y-%m-%d %H:%M')}"
            tasks = (PeriodicTask._default_manager.filter(name=name))
            for task in tasks:
                # Если таск есть - Плюсуем пользователей в user_list
                kwargs: dict = json.loads(task.kwargs)
                users_old = set(kwargs.get('users')) - (set(self.user_list))
                kwargs["users"] = list(users_old)
                task.kwargs = json.dumps(kwargs)
                task.save()

    @classmethod
    def flash_task(cls, task: Proxy, **kwargs) -> None:
        task.delay(**kwargs)

    def __repr__(self):
        return f"task: {self.data_start}"
