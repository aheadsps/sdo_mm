from config.celery import app
from lessons.models import Event, Course, Lesson
from django.db.models import Q
from users.models import User
from datetime import datetime
from django_celery_beat.models import PeriodicTask
import json
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

@app.task
def create_events(course_id: int | None = None,
                  users: list[int] | None = None,
                  start_date: str = None,
                  end_date: str | None = None,
                  status: str | None = 'expected',
                  ) -> None:
    """
    Создавать events
    в любом количестве по списку пользователей
    Если event есть обновляются даты начала и конца курса и статус
    """
    if start_date:
        start_date = datetime.strptime(start_date, "%Y-%m-%d %H:%M")
    else:
        raise ValueError
    if end_date:
        end_date = datetime.strptime(end_date, "%Y-%m-%d %H:%M")
    # Получаем курс
    course = Course._default_manager.get(pk=course_id)

    # 1. Получаем Events студентов, которым надо обновить курс

    events = Event._default_manager.filter(Q(course_id=course_id) & Q(user_id__in=users))
    update_events = list()
    for event in events:
        event.start_date = start_date
        event.end_date = end_date
        event.status = status
        update_events.append(event)
    events.bulk_update(update_events, ('start_date', 'end_date', 'status'))

    # 2. Получаем студентов, которым надо создать курс
    users = list(User._default_manager
                 .filter(~Q(events__course_id=course_id) &
                         Q(id__in=users))
                 )
    # Назначаем курсы студентам - добавляем в БД
    objs = Event._default_manager.bulk_create(
        [Event(
            user=user,
            course=course,
            start_date=start_date,
            end_date=end_date,
            status = status
        )
         for user
         in users]
    )

@app.task
def send_mail_users(course_id: int | None = None,
                  users: list[int] | None = None,
                  start_date: str = None,
                  end_date: str | None = None,
                  status: str | None = 'expected',
                  ) -> None:
    # Render template as a string
    users = list(User._default_manager.filter(id__in=users))
    for user in users:
        html_content = render_to_string('email/templated_email.html', {'name': user.first_name})
        msg = EmailMultiAlternatives(
            subject='Test Email',
            body='This is a test',
            from_email='from@example.com',
            to=[user.email]
        )
        msg.attach_alternative(html_content, 'text/html')
        msg.send()




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
    если количество уроков = пройденым то успех
    иначе провал
    """
    # получить количесто уроков в курсе
    quantity_lesson = Lesson._default_manager.filter(course_id=course_id).count()
    # успешно закончили курс
    events = (Event._default_manager.filter(course_id=course_id,
                                            user_id__in=users, done_lessons=quantity_lesson))
    update_events = list()
    for event in events:
        event.status = 'done'
        update_events.append(event)
    events.bulk_update(update_events, ('status',))

    # НЕ закончили курс
    events = (Event._default_manager.filter(course_id=course_id,
                                            user_id__in=users, done_lessons__lt=quantity_lesson))
    update_events = list()
    for event in events:
        event.status = 'failed'
        update_events.append(event)
    events.bulk_update(update_events, ('status',))
