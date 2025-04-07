from django_celery_beat.models import PeriodicTask, ClockedSchedule
import json
from django.utils import timezone
from django.db.models import Q
from datetime import datetime


class TaskManager:
    """
    Составление clocked_time задачи
    по передачи в функцию создания евента.
    Получает данные:
    id-course, user-создатель, список пользователей, дата-тайм начала,
    дата-тайм финиша (может null)
    """

    def __init__(
        self,
        course: int = None,
        user_list: list = None,
        data_start: datetime = None,
        data_end: datetime = None,
    ):
        self.course = course
        self.data_start = data_start
        self.data_end = data_end
        self.user_list = user_list
        if self.data_start:
            with_timezone = self._handle_datetime_to_task(self.data_start)
            self.schedule_start = self._clocked_schedule(with_timezone)
        else:
            self.schedule_start = self._clocked_schedule(timezone.now())

        if self.data_end:
            with_timezone = self._handle_datetime_to_task(self.data_end)
            self.schedule_end = self._clocked_schedule(with_timezone)
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

    def _handle_datetime_to_task(
        self,
        start_time: datetime,
    ) -> datetime:
        """
        Перерабатывает date в datatime время
        """
        year = start_time.year
        month = start_time.month
        day = start_time.day
        hour = start_time.hour
        minute = start_time.minute

        date_to_task = datetime(
            year=year,
            month=month,
            day=day,
            hour=hour,
            minute=minute,
            tzinfo=timezone.get_current_timezone(),
        )
        return date_to_task

    @staticmethod
    def date_str(dt: datetime):
        """
        Переводим datetime в строковой вид
        """
        if dt:
            return dt.strftime("%Y-%m-%d %H:%M")

    def create(self):
        """
        Создать задачу
        """
        # В kwargs передаем данные для вызова функции
        # создания эвента
        kwargs = {
            "course_id": self.course,
            "users": self.user_list,
            "start_date": TaskManager.date_str(self.data_start),
            "end_date": TaskManager.date_str(self.data_end),
        }
        # Задача на активацию events
        instance = PeriodicTask._default_manager.create(
            clocked=self.schedule_start,
            one_off=True,
            name=f'Event_{self.course}_at_{TaskManager.date_str(self.data_start)}',
            task="lessons.task.create_events",
            kwargs=json.dumps(kwargs),
        )
        # если ок создаем PeriodicTask на
        # перевод по истечению времени events в failed
        if instance and self.data_end:
            kwargs = dict(course_id=self.course, users=self.user_list)
            PeriodicTask._default_manager.create(
                clocked=self.schedule_end,
                one_off=True,
                name=f'Fail_{self.course}_at_{TaskManager.date_str(self.data_end)}',
                task="lessons.task.events_failed",
                kwargs=json.dumps(kwargs),
            )

        return instance

    def upload(self):
        """
        Редактировать задачу
        """
        tasks = list()
        name_task = f'Event_{self.course}_at_{TaskManager.date_str(self.data_start)}'
        task = PeriodicTask._default_manager.get(name=name_task)

        # Подготовка данных
        kwargs_old: dict = json.loads(task.kwargs)
        kwargs_old['start_date'] = (TaskManager.date_str(self.data_start)
                                    if self.data_start
                                    else kwargs_old['start_date'])
        kwargs_old['end_date'] = (TaskManager.date_str(self.data_end)
                                  if self.data_start
                                  else kwargs_old['end_date'])
        task.kwargs = json.dumps(kwargs_old)
        tasks.append(task)

        if self.data_start:
            task.clocked = self.schedule_start
        if self.data_end:
            name_task_failed = f'Fail_{self.course}_at_{TaskManager.date_str(self.data_end)}'
            task_to_fail = PeriodicTask._default_manager.get(name=name_task_failed)
            task_to_fail.clocked = self.schedule_end
            tasks.append(task_to_fail)

        PeriodicTask._default_manager.bulk_update(tasks)

    def delete(self):
        """
        Удаление пользователей из таски
        """
        name_task = f'Event_{self.course}_at_{TaskManager.date_str(self.data_start)}'
        name_task_failed = f'Fail_{self.course}_at_{TaskManager.date_str(self.data_end)}'
        tasks = list(PeriodicTask._default_manager
                     .filter(Q(name=name_task) |
                             Q(name=name_task_failed)
                             .delete()))

        for task in tasks:
            json_item = json.loads(task.kwargs)
            users = set(json_item['users'])
            users_delete = set(self.user_list)
            json_item['users'] = list(users - users_delete)
            task.kwargs = json.dumps(json_item)

        PeriodicTask._default_manager.bulk_update(tasks, ('kwargs',))

    def __repr__(self):
        return f"task: {self.data_start}"
