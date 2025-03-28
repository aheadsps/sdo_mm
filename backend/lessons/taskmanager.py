from django_celery_beat.models import PeriodicTask, CrontabSchedule

class MidnightSchedule:
    """
    Шедулер выполняется в полночь каждого дня
    """
    def __init__(self):
        self.schedule, _ = CrontabSchedule.objects.get_or_create(
            minute='0',
            hour='0',
            day_of_week='*',
            day_of_month='*',
            month_of_year='*',
        )

    def __repr__(self):


class TaskManager():

    def __init__(self,interval):
        self.interval=interval

    def create(self):
    """
    Создать шедулер
    """
    """PeriodicTask.objects.create(
        crontab=schedule,
        name='Importing contacts',
        task='proj.tasks.import_contacts',
    )"""
    kwargs = {
        'course_id': 1,
        'user': [],
        'start_date': 2022-10-10,
        'end_date': 2022-10-20,
    }
    instance = PeriodicTask.objects.create(
        crontab=schedule,
        name=name,
        task='create_events',
        interval=interval,
        start_time=start_time,
        kwargs=json.dumps(kwargs),
    )
    return instance
    """
    Создать шедулер
    """
    """
    Создать шедулер
    """
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