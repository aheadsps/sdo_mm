from config.celery import app
from lessons.models import Event, Course
from django.db.models import Q
from users.models import User
from datetime import datetime


@app.task
def create_events(
    course_id=None, users=None, start_date=None, end_date=None
) -> None:
    """
    Создавать events
    в любом количестве по списку пользователей
    Если event есть обновляются даты начала и конца курса
    """
    if start_date:
        start_date = datetime.strftime(str(start_date), "%Y-%m-%d %H:%M")
    if end_date:
        end_date = datetime.strftime(str(end_date), "%Y-%m-%d %H:%M")

    users = list(User._default_manager
                 .filter(~Q(events__course_id=course_id) &
                         Q(user_id__in=users))
                 .get_queryset())
    # Получаем курс
    course = Course._default_manager.get(pk=course_id)

    # 1. Добавляем Курсы пользователям
    # Составляем список курсов для добавления
    event_list = []
    for item_user in users:
        event_list.append(
            Event(
                user=item_user,
                course=course,
                start_date=start_date,
                end_date=end_date,
            )
        )
    # Назначаем курсы студентам - добавляем в БД
    objs = Event._default_manager.bulk_create(event_list)


@app.task
def events_failed(course_id: int) -> None:
    ...
