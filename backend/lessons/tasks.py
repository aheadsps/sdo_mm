from config.celery import app
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from users.models import User
from lessons import models


@app.task
def event_switch_status(event_id: int, started: bool) -> str:
    event = models.Event._default_manager.get(id=event_id)
    event.status = 'started' if started else 'finished'
    event.save(update_fields=('status',))
    course = event.course
    course.status = 'run' if started else 'end'
    course.save(update_fields=('status',))
    return 'Done'


@app.task
def lesson_switch_status(lesson_id: int, started: bool) -> str:
    if started:
        lesson = models.Lesson._default_manager.get(id=lesson_id)
        lesson.started = True
        lesson.save(update_fields=('started',))
    return 'Done'


@app.task
def test_block_process(test_block_id: int) -> str:
    # Проверка результатов и выставление статуса
    # Выставление failed если % прохождения ниже порога, а иначе done
    return 'Done'


@app.task
def update_status_events(course_id: int | None = None,
                  start_date: str = None,
                  end_date: str | None = None,
                  pk: int | None = None,
                  status: str | None = 'expected',
                  ) -> None:
    event = models.Event._default_manager.get(pk=pk)
    event.status = status
    event.save()

    # Меняем статусы в EventCovered
    """if status == 'process':
        events_covered = (models.EventCovered._default_manager.
                          filter(event=event.pk, status='expected')
                          )
        events_covered.status = 'process'
    if status == 'finished':
        events_covered = (models.EventCovered._default_manager.
                          filter(event=event.pk).
                          exclude(status='done')
                          )
        events_covered.status = 'failed'

    if events_covered:
        models.EventCovered._default_manager.bulk_update(
                events_covered,
                ["status"]
            )"""


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
