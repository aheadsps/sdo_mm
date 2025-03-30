from django_celery_beat.models import PeriodicTask, CrontabSchedule, ClockedSchedule
import json
from django.utils import timezone
from datetime import datetime
from django.utils.crypto import get_random_string


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


    def __init__(self,course: int, user_create: int, user_list: list, data_start: datetime, data_end: datetime=None):
        self.course = course
        self.user_create = user_create
        self.data_start = self._handle_datetime_to_task(data_start)
        self.data_end = data_end
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
            return dt.strftime("%Y-%B-%d %H:%M")
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
            'user': self.user_list,
            'start_date': TaskManager.date_str(self.data_start),
            'end_date': TaskManager.date_str(self.data_end),
        }

        instance = PeriodicTask.objects.create(
            clocked=self.schedule,
            one_off=True,
            name=self._create_unique_name_to_task(),
            task='lessons.task.create_events',
            kwargs=json.dumps(kwargs),
        )
        return instance


    def upload(self):
        """
        Редактировать задачу
        """
        pass

    """
    Создать шедулер
    """

# Пусть пока будет тут
def create_events(course_id: int, user_id: list, start_date, end_date) -> None:
    """
    создавать events
    в любом количестве по списку пользователей
    """
    pass