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

    # Назначаем курсы студентам - добавляем в БД
    objs = Event._default_manager.bulk_create(
        [Event(
            user=user,
            course=course,
            start_date=start_date,
            end_date=end_date,
        )
         for user
         in users]
    )


@app.task
def update_events(course_id: int,
                  users: list[int],
                  start_date: str | None,
                  end_date: str | None,
                  ) -> None:
    """
    Обновление ивентов
    Атрибуты должны пройти всю валидацию прежде чем прийти сюда
    """
    if start_date:
        start_date = datetime.strftime(str(start_date), "%Y-%m-%d %H:%M")
    if end_date:
        end_date = datetime.strftime(str(end_date), "%Y-%m-%d %H:%M")
    events = list(Event._default_manager
                  .filter(Q(course_id=course_id) & Q(user_id__in=users)))
    update_events = list()
    for event in events:
        event.start_date = start_date
        event.end_date = end_date
        update_events.append(event)
    events.bulk_update(update_events, ('start_date', 'end_date'))


@app.task
def delete_events(course_id: int,
                  users: list[int],
                  ) -> None:
    """
    Удаление ивентов
    """
    events = (Event._default_manager
              .filter(Q(course_id=course_id)
                      & Q(user_id__in=users))
              .delete())


@app.task
def events_failed(course_id: int, users: list[int]) -> None:
    """
    Установка статуса failed
    """
    events = (Event._default_manager
              .filter(course_id=course_id, user_id__in=users)
              .get_queryset())
    update_events = list()
    for event in events:
        event.status = 'failed'
        update_events.append(event)
    events.bulk_update(update_events, ('status',))
