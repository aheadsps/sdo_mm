from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.conf import settings

from lessons.utils import (path_maker_question,
                           path_maker_course,
                           )


class Answer(models.Model):
    """
    Модель представления Ответа
    """

    text = models.TextField(verbose_name='текст ответа',
                            help_text='Текст ответа',
                            )
    correct = models.BooleanField(verbose_name='корректность',
                                  help_text='Корректность данного ответа',
                                  )
    question = models.ForeignKey("lessons.Question",
                                 verbose_name=_("ответ"),
                                 related_name='answers',
                                 on_delete=models.CASCADE,
                                 )

    class Meta:
        verbose_name = _("Answer")
        verbose_name_plural = _("Answers")

    def __str__(self):
        return self.text[0:10] + '...'


class Question(models.Model):
    """
    Модель представления Вопроса
    """

    text = models.TextField(verbose_name='текст вопроса',
                            help_text='Текст вопроса',
                            )
    image = models.ImageField(upload_to=path_maker_question,
                              verbose_name='картинка',
                              help_text='Картинка для вопроса',
                              null=True,
                              )

    class Meta:
        verbose_name = _("Question")
        verbose_name_plural = _("Questions")

    def __str__(self):
        return self.text[0:10] + '...'


class Event(models.Model):
    """
    Модель представления Ивента
    """

    user = models.ForeignKey(get_user_model(),
                             verbose_name=_("пользователь"),
                             on_delete=models.CASCADE,
                             help_text='Пользователь которому '
                             'будет назначен ивент',
                             )
    course = models.ForeignKey('lessons.Course',
                               verbose_name='курс',
                               on_delete=models.CASCADE,
                               help_text='Курс который обворачивается'
                               'ивент',
                               )
    done_lessons = models.SmallIntegerField(_("Количество выполненых уроков"),
                                            default=0,
                                            )
    start_date = models.DateTimeField(verbose_name='дата начала ивента',
                                      null=True,
                                      help_text='Дата начала ивента, '
                                      'нужно для Celery что бы в рассписании '
                                      'поставить дату выдачи ивента',
                                      default=None,
                                      )
    end_date = models.DateTimeField(verbose_name='дедлайн',
                                    null=True,
                                    help_text='Дедлайн ивента, если'
                                    'дедлайна нет тогда бессрочно',
                                    default=None,
                                    )
    favorite = models.BooleanField(_("Избранный ивент"),
                                   default=False,
                                   help_text='Указатель является ли данный'
                                   'ивент избранным')
    status = models.CharField(choices=settings.STATUS_EVENTS,
                              null=True,
                              default='expected',
                              verbose_name='статус ивента',
                              help_text='Текущий статус данного ивента',
                              )

    class Meta:
        verbose_name = _("Event")
        verbose_name_plural = _("Events")

    def __str__(self):
        return f'event_for_user_{self.user.pk}_{self.pk}'


class Course(models.Model):
    """
    Модель представления курса
    """
    name = models.CharField(_("Название"),
                            max_length=256,
                            help_text='Название курса',
                            )
    description = models.TextField(_("Описание"),
                                   help_text='Описание курса',
                                   )
    beginer = models.BooleanField(_("Начинающий"),
                                  help_text='Курс для начинающих',
                                  default=False,
                                  )
    create_date = models.DateTimeField(_("Дата создания"),
                                       auto_now_add=True,
                                       help_text='Дата создания курса',
                                       )
    update_date = models.DateTimeField(_("Дата обновления"),
                                       auto_now=True,
                                       help_text='Дата обновления курса',
                                       )
    image = models.ImageField(_("Превью"),
                              upload_to=path_maker_course,
                              null=True,
                              )
    profession = models.ForeignKey("users.Profession",
                                   verbose_name=_("профессия"),
                                   on_delete=models.SET_NULL,
                                   null=True,
                                   )
    experiences = models.ManyToManyField("users.WorkExperience",
                                         verbose_name=_("Стаж"),
                                         help_text='На какие стажи расчитан '
                                         'курс',
                                         )

    class Meta:
        verbose_name = _("Course")
        verbose_name_plural = _("Courses")

    def __str__(self):
        return self.name
