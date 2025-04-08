from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.conf import settings
from lessons.utils import (
    path_maker_question,
    path_maker_course,
    path_maker_content_attachment,
)


class Event(models.Model):
    """
    Модель представления Ивента
    """
    user = models.ForeignKey(get_user_model(),
                             verbose_name=_("пользователь"),
                             on_delete=models.CASCADE,
                             help_text='Пользователь которому '
                                       'будет назначен ивент',
                             related_name='events',
                             )
    course = models.ForeignKey('lessons.Course',
                               verbose_name='курс',
                               on_delete=models.CASCADE,
                               help_text='Курс который обворачивается'
                                         'ивент',
                               related_name='events',
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
                              default='expect',
                              verbose_name='статус ивента',
                              help_text='Текущий статус данного ивента',
                              )

    class Meta:
        verbose_name = _("Event")
        verbose_name_plural = _("Events")

    def __str__(self):
        return f"event_for_user_{self.user.pk}_{self.pk}"


class Course(models.Model):
    """
    Модель представления курса
    """

    name = models.CharField(
        _("Название"),
        max_length=256,
        help_text="Название курса",
    )
    description = models.TextField(
        _("Описание"),
        help_text="Описание курса",
    )
    beginer = models.BooleanField(
        _("Начинающий"),
        help_text="Курс для начинающих",
        default=False,
    )
    create_date = models.DateTimeField(
        _("Дата создания"),
        auto_now_add=True,
        help_text="Дата создания курса",
    )
    update_date = models.DateTimeField(
        _("Дата обновления"),
        auto_now=True,
        help_text="Дата обновления курса",
    )
    image = models.ImageField(
        _("Превью"),
        upload_to=path_maker_course,
        null=True,
    )
    profession = models.ForeignKey(
        "users.Profession",
        verbose_name=_("профессия"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='courses',
    )
    experiences = models.ManyToManyField(
        "users.WorkExperience",
        verbose_name=_("Стаж"),
        help_text="На какие стажи расчитан " "курс",
    )

    class Meta:
        verbose_name = _("Course")
        verbose_name_plural = _("Courses")

    def __str__(self):
        return self.name


class Lesson(models.Model):
    """
    Модель преставления урока
    """
    name = models.CharField(_("Название"),
                            max_length=256,
                            null=False,
                            blank=False,
                            help_text="Название урока",
                            )
    serial = models.IntegerField(_("Номер"),
                                 null=False,
                                 blank=False,
                                 validators=[MinValueValidator(1)],
                                 default=1,
                                 help_text="Порядковый номер урока"
                                 )
    course = models.ForeignKey(Course,
                               verbose_name=_("Курс"),
                               on_delete=models.CASCADE,
                               related_name='lessons',
                               null=True,
                               blank=True,
                               )

    class Meta:
        verbose_name = _("Lesson")
        verbose_name_plural = _("Lessons")

    def __str__(self):
        return self.name


class Step(models.Model):
    """
    Шаги урока
    """

    title = models.CharField(
        max_length=256, null=False, blank=False, verbose_name="Шаг урока"
    )
    content_text = models.TextField(
        verbose_name="Контент шага урока",
        null=True,
        blank=True,
    )
    serial = models.IntegerField(
        null=False, blank=False, default=1,
        verbose_name="Порядковый номер шага"
    )
    lesson = models.ForeignKey(Lesson,
                               verbose_name=_("Урок"),
                               on_delete=models.CASCADE,
                               related_name='steps',
                               null=True,
                               blank=True,
                               )

    class Meta:
        verbose_name = "Шаг урока"
        verbose_name_plural = "Шаги урока"
        ordering = ["title"]

    def __str__(self):
        return f"Шаг: {self.title}"


class ContentAttachment(models.Model):
    file = models.FileField(
        upload_to=path_maker_content_attachment, null=True, blank=True
    )
    file_type = models.CharField(
        max_length=10, choices=settings.TYPE_CONTENTS,
        default="Image", verbose_name="Тип файла"
    )
    step = models.ForeignKey(
        Step, unique=False,
        on_delete=models.CASCADE,
        related_name='attachments',
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Контент для шага урока"
        verbose_name_plural = "Контент для шага урока"

    def __str__(self):
        return self.file.name


class TestBlock(models.Model):
    """
    Модель тестового блока
    """

    lesson = models.OneToOneField(Lesson,
                                  on_delete=models.CASCADE,
                                  related_name="test_block",
                                  null=True,
                                  blank=True,
                                  )

    class Meta:
        verbose_name = "тестовый блок"
        verbose_name_plural = "тестовые блоки"

    def __str__(self):
        return f'test-block-{self.pk}'


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
                              blank=True,
                              )
    test_block = models.ForeignKey(TestBlock,
                                   verbose_name=_("тестовый блок"),
                                   on_delete=models.CASCADE,
                                   related_name='questions',
                                   null=True,
                                   blank=True,
                                   )

    class Meta:
        verbose_name = _("Question")
        verbose_name_plural = _("Questions")

    def __str__(self):
        return self.text[0:10] + "..."


class Answer(models.Model):
    """
    Модель представления Ответа
    """

    text = models.TextField(
        verbose_name="текст ответа",
        help_text="Текст ответа",
    )
    correct = models.BooleanField(
        verbose_name="корректность",
        help_text="Корректность данного ответа",
    )
    question = models.ForeignKey(
        Question,
        verbose_name=_("ответ"),
        related_name="answers",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = _("Answer")
        verbose_name_plural = _("Answers")

    def __str__(self):
        return self.text[0:10] + "..."
