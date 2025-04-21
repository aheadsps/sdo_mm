from datetime import timedelta, datetime

from loguru import logger

from django.template import TemplateDoesNotExist, loader
from django.core.mail import EmailMultiAlternatives
from django.urls import NoReverseMatch
from django.db.models import QuerySet, Q
from django.db.transaction import atomic
from django.contrib.auth import get_user_model
from django.conf import settings
from django_celery_beat.models import PeriodicTask

from lessons import models
from lessons.utils import get_intervals
from lessons.taskmanagers import (
    TaskManagerEventSwitch,
    TaskManagerLessonSwitch,
    TaskManagerTestBlockSwitch,
    TaskManagerSendMail,
    )


class SetEventServise:
    """
    Сервис настройки эвента
    """

    def __init__(self,
                 instance: models.Event,
                 update: bool = False,
                 ):
        self._event = instance
        self.update = update

    @property
    def event(self):
        return self._event

    def _set_users(self,
                   event: models.Event,
                   course: models.Course,
                   ) -> None:
        profession = course.profession
        logger.debug(f'professon for find users {profession}')
        experiences = course.experiences.get_queryset()
        logger.debug(f'experiences for find users {experiences}')
        years_experience = get_intervals(
            experiences=experiences,
            )
        qfilter = Q(*[Q(date_commencement__gte=year[0], date_commencement__lte=year[-1])
                      for year
                      in years_experience],
                    _connector=Q.OR,
                    )
        users = get_user_model()._default_manager.filter(qfilter)
        if profession:
            users = users.filter(Q(profession=profession))
        logger.debug(f'find users depends on experience {users}')
        models.EventCovered._default_manager.bulk_create(
            [models.EventCovered(
                user=user,
                event=event,
                status='process',
                ) for user in users]
        )

    def _change_status(self,
                       course: models.Course,
                       ) -> None:
        if not course.status == 'run':
            course.status = 'run'
            course.save(update_fields=('status',))

    def _set_event_status(self,
                          event: models.Event,
                          ) -> None:
        event.status = "started"
        event.save()

    def _set_test_block_begginer(self,
                                 test_block: models.TestBlock,
                                 ):
        questions = test_block.questions.all()
        max_score = 0
        if questions:
            if not test_block.max_score:
                for question in test_block.questions.get_queryset():
                    max_score += question.weight
                test_block.max_score = max_score
        return test_block

    def _set_test_block(self,
                        test_block: models.TestBlock,
                        end_date: datetime,
                        schedulers: list,
                        update: bool,
                        ) -> models.TestBlock:
        questions = test_block.questions.all()
        max_score = 0
        if questions:
            if not test_block.max_score:
                for question in test_block.questions.get_queryset():
                    max_score += question.weight
                test_block.max_score = max_score
            if update:
                TaskManagerTestBlockSwitch(test_block.end_date,
                                           test_block.pk,
                                           ).update(clocked=end_date)
                test_block.end_date = end_date
            else:
                test_block.end_date = end_date
                schedulers.append(TaskManagerTestBlockSwitch(end_date,
                                                             test_block.pk,
                                                             ).bulk_create())
        return test_block

    def _set_email_send(self,
                        date: datetime,
                        event: models.Event,
                        update: bool,
                        ) -> None:
        covers = models.EventCovered._default_manager.filter(event=event)
        ids_users = [cover.user.pk for cover in covers]
        template = 'lessons/start_event.html'
        task_manager = TaskManagerSendMail(date, event.course.pk, ids_users, template, 'Курс')
        if not update:
            task_manager.create()
        else:
            task_manager.update(clocked=date)

    def _delete_email_send(self,
                           date: datetime,
                           event: models.Event,
                           ) -> None:
        task_manager = TaskManagerSendMail(date, event.course.pk, None, None, 'Курс')
        task_manager.delete()

    def _count_end_date(self,
                        instance: models.Event,
                        lessons: QuerySet[models.Lesson] | None,
                        interval: timedelta,
                        start_date: datetime,
                        update: bool,
                        ) -> None:
        update_lessons = []
        update_test_block = []
        schedulers = []
        beginner = instance.course.beginner
        content = lessons
        if not beginner:
            schedulers.append(TaskManagerEventSwitch(start_date,
                                                     self.event.id,
                                                     True,
                                                     ).bulk_create())
            for lesson in content:
                lesson.start_date = start_date
                logger.info(f'set start date to {lesson} - {lesson.start_date}')
                schedulers.append(TaskManagerLessonSwitch(start_date,
                                                          lesson.pk,
                                                          started=True,
                                                          ).bulk_create())
                start_date = start_date + interval
                lesson.end_date = start_date
                logger.info(f'set end date to {lesson} - {lesson.end_date}')
                schedulers.append(TaskManagerLessonSwitch(start_date,
                                                          lesson.pk,
                                                          started=False,
                                                          ).bulk_create())
                update_lessons.append(lesson)
                test_block = lesson.test_block
                update_test_block.append(self._set_test_block(
                    test_block=test_block,
                    end_date=start_date,
                    schedulers=schedulers,
                    update=update,
                ))
            instance.end_date = start_date
            schedulers.append(TaskManagerEventSwitch(start_date,
                                                     self.event.id,
                                                     False,
                                                     ).bulk_create())
            PeriodicTask._default_manager.bulk_create(schedulers)
        else:
            for lesson in content:
                lesson.started = True
                test_block = lesson.test_block
                update_lessons.append(lesson)
                update_test_block.append(self._set_test_block_begginer(
                    test_block=test_block,
                ))
        models.Lesson._default_manager.bulk_update(update_lessons,
                                                   fields=("start_date",
                                                           "end_date",
                                                           "started",
                                                           ),
                                                   )
        models.TestBlock._default_manager.bulk_update(update_test_block,
                                                      fields=('max_score',
                                                              'end_date',
                                                              ),
                                                      )
        instance.save()

    def _clear_test_block(self,
                          test_block: models.TestBlock,
                          beginner: bool,
                          ) -> models.TestBlock:
        if not beginner:
            end_date = test_block.end_date
            if end_date:
                TaskManagerTestBlockSwitch(end_date, test_block.pk).delete()
            test_block.end_date = None
        else:
            test_block.max_score = 0
        return test_block

    def _clear_lesson(self,
                      lesson: models.Lesson,
                      beginner: bool,
                      ) -> models.Lesson:
        if not beginner:
            start_date = lesson.start_date
            end_date = lesson.end_date
            logger.debug(f'clear lesson with dates {start_date} - {end_date}')
            TaskManagerLessonSwitch(start_date, lesson.pk, True).delete()
            TaskManagerLessonSwitch(end_date, lesson.pk, False).delete()
            lesson.start_date = None
            lesson.end_date = None
        else:
            lesson.started = False
        return lesson

    def _process_delete_settings(self,
                                 event: models.Event,
                                 course: models.Course,
                                 lessons: QuerySet[models.Lesson],
                                 beginner: bool,
                                 ) -> None:
        if not beginner:
            start_date = event.start_date
            end_date = event.end_date
            logger.warning(f'delete task with dates {start_date} - {end_date}')
            TaskManagerEventSwitch(start_date, event.pk, True).delete()
            TaskManagerEventSwitch(end_date, event.pk, False).delete()
        course.status = 'archive'
        course.save(update_fields=('status',))
        lessons_update = []
        test_block_update = []
        for lesson in lessons:
            test_block = lesson.test_block
            lessons_update.append(
                self._clear_lesson(lesson, beginner),
                )
            test_block_update.append(
                self._clear_test_block(test_block, beginner),
                )
        models.Lesson._default_manager.bulk_update(lessons_update, fields=('started',
                                                                           'start_date',
                                                                           'end_date',
                                                                           ))
        models.TestBlock._default_manager.bulk_update(test_block_update, fields=('max_score', 'end_date'))

    def set_event_settings(self):
        """
        Установка всех настроек Event
        """
        course = self.event.course
        start_date = self.event.start_date
        lessons = (models.Lesson
                   ._default_manager
                   .filter(course=course)
                   .prefetch_related('test_block__questions')
                   .order_by("serial"))
        interval = self.event.course.interval
        with atomic():
            self._count_end_date(
                instance=self.event,
                lessons=lessons,
                start_date=start_date,
                interval=interval,
                update=self.update,
            )
            if not self.update:
                if course.beginner:
                    self._set_event_status(event=self.event)
                    self._set_users(
                        event=self.event,
                        course=course,
                    )
            self._change_status(course=course)

    def delete_event_settings(self):
        """
        Удаление настроек
        """
        course = self.event.course
        lessons = (models.Lesson
                   ._default_manager
                   .filter(course=course)
                   .select_related('test_block')
                   .order_by("serial"))
        beginner = course.beginner
        self._process_delete_settings(
            event=self.event,
            course=course,
            lessons=lessons,
            beginner=beginner,
        )


def send_mails(course: str,
               type_content: str,
               users,
               template: str,
               ) -> None:
    """Функция для оправки письма,
    является внутренней начинкой другой функции TASK
    """
    email_template_name = template
    subject_template_name = settings.SUBJECT_PATH
    server_mail: str = settings.EMAIL_HOST_USER
    user_email: str = [user.email for user in users]
    bbc: str = [settings.EMAIL_BCC]

    context = dict(
        type_content=type_content,
        system='edu.sdo-metro.ru',
        course=course,
    )

    try:
        subject = loader.render_to_string(
            subject_template_name,
            context=context,
            )
        subject = "".join(subject.splitlines())
    except TemplateDoesNotExist:
        raise TemplateDoesNotExist(
            f'По заданному пути: {subject_template_name} - '
            'шаблон не был найден',
            )
    except NoReverseMatch:
        raise NoReverseMatch('Ошибка при постоении пути')

    try:
        body = loader.render_to_string(
            email_template_name,
            context=context,
            )
    except TemplateDoesNotExist:
        raise TemplateDoesNotExist(
            f'По заданному пути: {email_template_name} - '
            'шаблон не был найден',
            )
    except NoReverseMatch:
        raise NoReverseMatch('Ошибка при постоении пути')

    email_message = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=server_mail,
        to=user_email,
        bcc=bbc,
        )
    return email_message.send()
