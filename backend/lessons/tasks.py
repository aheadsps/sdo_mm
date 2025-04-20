from config.celery import app

from django.db.models import Q
from django.contrib.auth import get_user_model

from lessons import models
from lessons.servises import send_mails


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
def send_mail_users(course: str,
                    users: list[int],
                    type_content: str,
                    template: str,
                    ) -> str:
    qfilter = Q(*[Q(id=user_id) for user_id in users])
    users = get_user_model()._default_manager.filter(qfilter).get_queryset()
    send_mails(
        course=course,
        type_content=type_content,
        users=users,
        template=template,
    )
    return 'Done'
