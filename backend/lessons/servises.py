from datetime import timedelta, datetime

from loguru import logger

from django.db.models import QuerySet, Q
from django.db.transaction import atomic
from django.contrib.auth import get_user_model

from lessons import models
from lessons.utils import get_intervals


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
        experiences = course.experiences.get_queryset()
        years_experience = get_intervals(
            experiences=experiences,
            )
        logger.debug(f'intervals experience for search users is {years_experience}')
        qfilter = Q(*[Q(date_commencement__gt=year[0], date_commencement__lt=year[-1])
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
        event.status = "process"
        event.save()

    def _set_test_block(self,
                        lesson: models.Lesson,
                        end_date: datetime,
                        ) -> models.TestBlock:
        test_block = lesson.test_block
        max_score = 0
        for answer in test_block.answers:
            max_score += answer.weight
        test_block.max_score = max_score
        test_block.end_date = end_date
        return test_block

    def _count_end_date(self,
                        instance: models.Event,
                        lessons: QuerySet[models.Lesson],
                        interval: timedelta,
                        start_date: datetime,
                        update: bool,
                        ) -> None:
        update_lessons = []
        update_test_block = []
        for lesson in lessons:
            # Собираем шедулеры по открытия урока
            lesson.start_date = start_date
            update_lessons.append(lesson)
            start_date = start_date + interval
            update_test_block.append(self._set_test_block(
                lesson=lesson,
                end_date=start_date,
            ))
        models.Lesson._default_manager.bulk_update(update_lessons, fields=("start_date",))
        models.TestBlock._default_manager.bulk_update(update_test_block, fields=('max_score', 'end_date'))
        # Здесь дополнить еще одним шедулером на окончание курса
        instance.end_date = start_date
        # Множественное сохранение шедулеров
        instance.save()

    def set_event_settings(self):
        """
        Установка всех настроек Event
        """
        course = self.event.course
        start_date = self.event.start_date
        lessons = self.event.lessons.prefetch_related('test_block__questions').order_by("serial")
        interval = self.event.course.interval
        with atomic():
            if not course.beginner:
                self._count_end_date(
                    instance=self.event,
                    lessons=lessons,
                    start_date=start_date,
                    interval=interval,
                    update=self.update,
                )
            else:
                self._set_users()
                self._set_event_status(event=self.event)
            self._change_status(course=course)
            self.test_block_core([lesson.test_block for lesson in lessons]).set_test_block_settings()
