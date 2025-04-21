from config.celery import app

from django.db.models import Q
from django.contrib.auth import get_user_model

from lessons import models
from lessons.servises import send_mails


@app.task()
def event_switch_status(event_id: int, started: bool) -> str:
    event = models.Event._default_manager.get(id=event_id)
    template = 'lessons/start_event.html' if started else 'lessons/end_event.html'
    event_status = 'started' if started else 'finished'
    course_status = 'run' if started else 'end'
    event.status = event_status
    event.save(update_fields=('status',))
    course = event.course
    course.status = course_status
    course.save(update_fields=('status',))

    if started:
        covers = models.EventCovered._default_manager.filter(event__course=course)
        updated_covers = []
        for cover in covers:
            cover.status = 'process'
            updated_covers.append(cover)
        covers.bulk_update(updated_covers, fields=('status',))

    start_email_send(course.name, course, template, 'Курс')
    return 'Done'


@app.task()
def lesson_switch_status(lesson_id: int, started: bool) -> str:
    template = 'lessons/start_event.html' if started else 'lessons/end_event.html'
    if started:
        lesson = models.Lesson._default_manager.get(id=lesson_id)
        lesson.started = True
        lesson.save(update_fields=('started',))
    course = lesson.course
    start_email_send(course.name, course, template, 'Урок')
    return 'Done'


@app.task()
def test_block_process(test_block_id: int) -> str:
    # Проверка результатов и выставление статуса
    # Выставление failed если % прохождения ниже порога, а иначе done
    return 'Done'


@app.task()
def send_mail_users(course: str,
                    users: list[int],
                    type_content: str,
                    template: str,
                    ) -> str:
    qfilter = Q(*[Q(id=user_id) for user_id in users])
    users = get_user_model()._default_manager.filter(qfilter)
    send_mails(
        course=course,
        type_content=type_content,
        users=users,
        template=template,
    )
    return 'Done'


def start_email_send(name_content: str,
                     course: models.Course,
                     template: str,
                     type_content: str,
                     ):
    covers = (models.
              EventCovered.
              _default_manager.
              filter(event__course=course))
    users = [cover.user.pk for cover in covers]
    send_mail_users(name_content,
                    users,
                    type_content,
                    template,
                    )
