from config.celery import app
from lessons.models import Event, Course
from users.models import User
import datetime
from typing import Optional
from django.utils import timezone


@app.task
def create_events(course_id=None,
                  user_create=None,
                  user=None,
                  start_date=None,
                  end_date=None) -> None:
    """
    Создавать events
    в любом количестве по списку пользователей
    Если event есть обновляются даты начала и конца курса
    """
    def str_in_datetime(str_date: Optional[str]) -> Optional[datetime]:
        """ перевод строки в дататайм """
        if str_date:
            dt = datetime.datetime.strptime(str_date,
                                       "%Y-%m-%d %H:%M")
            year = dt.year
            month = dt.month
            day = dt.day
            hour = dt.hour
            minute = dt.minute

            dt = datetime.datetime(
                year=year,
                month=month,
                day=day,
                hour=hour,
                minute=minute,
                tzinfo=timezone.get_current_timezone()
            )
            return dt
        return None

    # Проверка на дублирование.
    event = Event._default_manager.filter(user_id__in=user, course_id=course_id)
    # Если есть дубляжи
    # оставляем список для апдайта
    user_for_update = []
    if event:
        for item in event:
            user_for_update.append(item.user.pk)

    user = set(set(user) - set(user_for_update))
    # user - список юзеров на добавление
    # user_for_update - список юзеров на обновление

    # Получаем курс
    course = Course._default_manager.get(pk=course_id)
    # Получаю юзеров
    users = User._default_manager.filter(pk__in=user)

    # 1. Добавляем Курсы пользователям
    # Составляем список курсов для добавления
    event_list = []
    for item_user in users:
        event_list.append(
            Event(user=item_user,
                  course=course,
                  start_date=str_in_datetime(start_date),
                  end_date=str_in_datetime(end_date),
                  )
        )
    # Назначаем курсы студентам - добавляем в БД
    objs = Event._default_manager.bulk_create(event_list)

    # 2. В существующих Курсах правим даты
    if event:
        event.update(
                    start_date=str_in_datetime(start_date),
                    end_date=str_in_datetime(end_date),
                    )
