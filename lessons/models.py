from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

from lessons.utils import path_maker_text


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
    image = models.ImageField(upload_to=path_maker_text,
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
    user = models.ForeignKey(get_user_model(),
                             verbose_name=_("пользователь"),
                             on_delete=models.CASCADE,
                             help_text='Пользователь которому '
                             'будет назначен ивент',
                             )
    # course = models.ForeignKey('lessons.Course',
    #                            verbose_name='курс',
    #                            on_delete=models.CASCADE,
    #                            help_text='Курс который обворачивается'
    #                            'ивент',
    #                            )
    # done_lessons =

    class Meta:
        verbose_name = _("Event")
        verbose_name_plural = _("Events")

    def __str__(self):
        return self.name
