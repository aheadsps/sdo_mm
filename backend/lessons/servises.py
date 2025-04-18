from datetime import timedelta, datetime, timezone

from loguru import logger

from django.db.models import QuerySet, Q
from django.db.transaction import atomic
from django.contrib.auth import get_user_model
from django_celery_beat.models import PeriodicTask

from lessons import models
from lessons.utils import get_intervals
from lessons.taskmanagers import (
    TaskManagerEventSwitch,
    TaskManagerLessonSwitch,
    TaskManagerTestBlockSwitch,
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

    def _set_test_block(self,
                        lesson: models.Lesson,
                        end_date: datetime,
                        beginner: bool,
                        schedulers: list,
                        update: bool,
                        ) -> models.TestBlock:
        test_block = lesson.test_block
        questions = test_block.questions.all()
        max_score = 0
        if questions:
            if not test_block.max_score:
                for question in test_block.questions.get_queryset():
                    max_score += question.weight
                test_block.max_score = max_score
            if not beginner:
                if update:
                    TaskManagerTestBlockSwitch(test_block.end_date, test_block.pk).update(start_time=end_date)
                    test_block.end_date = end_date
                else:
                    test_block.end_date = end_date
                    schedulers.append(TaskManagerTestBlockSwitch(end_date, test_block.pk).bulk_create())
            return test_block

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
        schedulers.append(TaskManagerEventSwitch(start_date,
                                                 self.event.id,
                                                 True,
                                                 ).bulk_create())
        for lesson in content:
            if not beginner:
                lesson.start_date = start_date
                update_lessons.append(lesson)
                schedulers.append(TaskManagerLessonSwitch(start_date,
                                                          lesson.pk,
                                                          ).bulk_create())
                start_date = start_date + interval
                lesson.end_date = start_date
            else:
                lesson.started = True
                update_lessons.append(lesson)
            update_test_block.append(self._set_test_block(
                lesson=lesson,
                end_date=start_date,
                beginner=beginner,
                schedulers=schedulers,
                update=update,
            ))
        models.Lesson._default_manager.bulk_update(update_lessons, fields=("start_date", "started"))
        if not update and None not in update_test_block:
            models.TestBlock._default_manager.bulk_update(update_test_block, fields=('max_score', 'end_date'))
        instance.end_date = start_date
        schedulers.append(TaskManagerEventSwitch(start_date,
                                                 self.event.id,
                                                 False,
                                                 ).bulk_create())
        PeriodicTask._default_manager.bulk_create(schedulers)
        instance.save()

    def set_event_settings(self):
        """
        Установка всех настроек Event
        """
        course = self.event.course
        start_date = self.event.start_date
        lessons = self.event.course.lessons.prefetch_related('test_block__questions').order_by("serial")
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
