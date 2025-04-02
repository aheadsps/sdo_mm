from django_celery_beat.models import PeriodicTask, CrontabSchedule, ClockedSchedule
import json
from django.utils import timezone
from datetime import datetime
from django.utils.crypto import get_random_string
from config.celery import app


class TaskManager:
    """
    Составление clocked_time задачи
    по передачи в функцию создания евента.
    Получает данные:
    id-course, список пользователей, дата-тайм начала,  дата-тайм финиша (может null)
    """


    def _crontab_schedule(self):
        """
        Назначаем шедулер
        """
        # Проверка есть ли созданый шедулер
        # если нет создаем новый
        schedule, _ = ClockedSchedule._default_manager.get_or_create(clocked_time=self.data_start)
        return schedule

    def __init__(self,course: int=None,
                 user_create: int=None,
                 user_list: list=None,
                 data_start: datetime=None,
                 data_end: datetime=None
                 ):
        self.course = course
        self.user_create = user_create
        self.data_start = data_start
        if data_start:
            self.data_start = self._handle_datetime_to_task(data_start)
        self.data_end = data_end
        if data_end:
            self.data_end =  self._handle_datetime_to_task(data_end)
        self.user_list = user_list
        # Выбираем шедулер
        self.schedule = self._crontab_schedule()


    def _handle_datetime_to_task(self,
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
            tzinfo=timezone.get_current_timezone()
        )
        return date_to_task


    @staticmethod
    def date_str(dt: datetime):
        """
        Переводим datetime в строковой вид
        """
        if dt:
            return dt.strftime("%Y-%m-%d %H:%M")
        else:
            return None


    def __repr__(self):
        return f"task: {self.data_start}"


    def _create_unique_name_to_task(self) -> str:
        """
        Создание уникального имени для
        периодической задачи
        """
        return f'Course_{self.course}_{self.user_create}_at_{self.data_start}_{get_random_string(5)}'


    def create(self):
        """
        Создать заадчу
        """
        # В kwargs передаем данные для вызова функции
        # создания эвента
        kwargs = {
            'course_id': self.course,
            'user_creata': self.user_create,
            'user': self.user_list,
            'start_date': TaskManager.date_str(self.data_start),
            'end_date': TaskManager.date_str(self.data_end),
        }

        instance = PeriodicTask._default_manager.create(
            clocked=self.schedule,
            one_off=True,
            name=self._create_unique_name_to_task(),
            task='lessons.task.create_events',
            kwargs=json.dumps(kwargs),
        )
        return instance




    def upload(self,id_task):
        """
        Редактировать задачу
        """
        task = PeriodicTask._default_manager.get(id=id_task)

        # Подготовка данных
        kwargs_old = json.loads(task.kwargs)
        if self.course:
            course = self.course
        else:
            course = kwargs_old.get('course_id')

        if self.user_list:
            user_list = self.user_list
        else:
            user_list = kwargs_old.get('user')

        if self.data_start:
            data_start = TaskManager.date_str(self.data_start)
        else:
            data_start = kwargs_old.get('start_date')

        if self.data_end:
            data_end = TaskManager.date_str(self.data_end)
        else:
            data_end = kwargs_old.get('end_date',None)
            if data_end:
                data_end = TaskManager.date_str(data_end)

        kwargs_new = {
            'course_id': course,
            'user_creata': kwargs_old.get('user_creata'),
            'user': user_list,
            'start_date': data_start,
            'end_date': data_end,
        }
        kwargs = json.dumps(kwargs_new)
        if kwargs != task.kwargs:
            task.kwargs = kwargs
            # если новый kwargs отличается от старого - update
            if data_start != kwargs_old.get('start_date'):
                # если новая дата старта делаем новый шедулер
                task.clocked = self.schedule
            else:
                task.name = self._create_unique_name_to_task()

            task.save()








    """
    Создать шедулер
    """

