from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.conf import settings
from lessons.utils import (
    path_maker_question,
    path_maker_course,
    path_maker_content_attachment,
    path_maker_scorm,
)
from lessons.validators_models import (UserStoryValidator,
                                       LessonStoryValidator,
                                       )


class Event(models.Model):
    """
    Модель представления Ивента
    """
    course = models.ForeignKey('lessons.Course',
                               verbose_name='курс',
                               on_delete=models.CASCADE,
                               help_text='Курс который обворачивается'
                                         'ивент',
                               related_name='events',
                               )
    start_date = models.DateTimeField(verbose_name='дата начала ивента',
                                      null=True,
                                      blank=True,
                                      default=None,
                                      )
    end_date = models.DateTimeField(verbose_name='дедлайн',
                                    null=True,
                                    blank=True,
                                    default=None,
                                    )
    status = models.CharField(choices=settings.STATUS_EVENTS,
                              default='expected',
                              verbose_name='статус ивента',
                              help_text='Текущий статус данного ивента',
                              )

    class Meta:
        verbose_name = _("Event")
        verbose_name_plural = _("Events")

    def __str__(self):
        return f"event_with_course_{self.course.pk}"


class EventCovered(models.Model):
    """
    Покрытие эвентами
    """
    user = models.ForeignKey(get_user_model(),
                             verbose_name=_("пользователь"),
                             on_delete=models.CASCADE,
                             related_name='events',
                             )
    event = models.ForeignKey(Event,
                              verbose_name=_("эвент"),
                              on_delete=models.CASCADE,
                              related_name='covers',
                              )
    favorite = models.BooleanField(_("Избранный ивент"),
                                   default=False,
                                   help_text='Указатель является ли данный'
                                             'ивент избранным')
    procent = models.SmallIntegerField(_("Процент прохождения"),
                                       default=0,
                                       validators=[MinValueValidator(0), MaxValueValidator(100)],
                                       )
    status = models.CharField(_("статус"),
                              max_length=50,
                              choices=settings.STATUS_COVERED,
                              default='expected',
                              )

    class Meta:
        verbose_name = _("EventCovered")
        verbose_name_plural = _("EventCovereds")

    def __str__(self):
        return f'user_{self.user.pk}_event_{self.event.pk}'


class Course(models.Model):
    """
    Модель представления курса
    """
    teacher = models.ForeignKey(get_user_model(),
                                verbose_name=_("учитель"),
                                on_delete=models.SET_NULL,
                                null=True,
                                )
    name = models.CharField(
        _("Название"),
        max_length=256,
        help_text="Название курса",
        null=True,
        blank=True,
    )
    description = models.TextField(
        _("Описание"),
        help_text="Описание курса",
        null=True,
        blank=True,
        default=None,
    )
    interval = models.DurationField(verbose_name=_('интервал'),
                                    null=True,
                                    blank=True,
                                    )
    beginner = models.BooleanField(
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
        blank=True,
    )
    is_scorm = models.BooleanField(_("флаг скорм пакета"), default=False)
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
        null=True,
        blank=True
    )
    status = models.CharField(_("статус"),
                              max_length=50,
                              choices=settings.STATUS_COURSE,
                              default='archive',
                              )

    class Meta:
        verbose_name = _("Course")
        verbose_name_plural = _("Courses")

    def __str__(self):
        return self.name


class SCORMFile(models.Model):
    """
    Модель представления SCORM файлов
    """
    course = models.ForeignKey(Course,
                               verbose_name=_("SCORM"),
                               related_name='files',
                               on_delete=models.CASCADE,
                               null=True,
                               blank=True,
                               )
    name = models.CharField(_("имя"),
                            max_length=256,
                            null=True,
                            blank=True,
                            )
    file = models.FileField(_("файл scorm"),
                            upload_to=path_maker_scorm,
                            )

    class Meta:
        verbose_name = _("SCORMFile")
        verbose_name_plural = _("SCORMFiles")

    def __str__(self):
        return self.file.name


class Lesson(models.Model):
    """
    Модель преставления урока
    """
    teacher = models.ForeignKey(get_user_model(),
                                verbose_name=_("учитель"),
                                on_delete=models.SET_NULL,
                                null=True,
                                )
    name = models.CharField(_("Название"),
                            max_length=256,
                            null=False,
                            blank=False,
                            help_text="Название урока",
                            )
    version = models.CharField(_('версия'),
                               max_length=50,
                               choices=settings.VERSIONS_SCORM,
                               help_text='Для SCORM пакета',
                               null=True,
                               blank=True,
                               )
    serial = models.IntegerField(_("Номер"),
                                 null=False,
                                 blank=False,
                                 validators=[MinValueValidator(1)],
                                 default=1,
                                 help_text="Порядковый номер урока"
                                 )
    resourse = models.CharField(max_length=256,
                                verbose_name=_('resourse'),
                                help_text='Для SCORM пакета',
                                null=True,
                                blank=True,
                                )
    course = models.ForeignKey(Course,
                               verbose_name=_("Курс"),
                               on_delete=models.CASCADE,
                               related_name='lessons',
                               null=True,
                               blank=True,
                               )
    started = models.BooleanField(_("флаг начатого"),
                                  default=False,
                                  )
    start_date = models.DateTimeField(_("время начала"),
                                      null=True,
                                      )
    end_date = models.DateTimeField(_("время конца"),
                                    null=True,
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
    teacher = models.ForeignKey(get_user_model(),
                                verbose_name=_("учитель"),
                                on_delete=models.SET_NULL,
                                null=True,
                                )
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


class Materials(models.Model):
    """
    Материалы к курсу
    """
    course = models.ForeignKey(Course,
                               verbose_name=_("курс"),
                               related_name='materials',
                               on_delete=models.CASCADE,
                               )


class ContentAttachment(models.Model):
    file = models.FileField(
        upload_to=path_maker_content_attachment, null=True, blank=True
    )
    file_type = models.CharField(
        max_length=10, choices=settings.TYPE_CONTENTS,
        default="Image", verbose_name="Тип файла"
    )
    materials = models.ForeignKey(Materials,
                                  verbose_name=_('материалы'),
                                  null=True,
                                  blank=True,
                                  on_delete=models.CASCADE,
                                  related_name='files',
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
    end_date = models.DateTimeField(_("время окончания"),
                                    null=True,
                                    blank=True,
                                    )
    max_score = models.FloatField(_("максимальный балл"),
                                  null=True,
                                  blank=True,
                                  )
    status = models.CharField(_("Статус"),
                              max_length=10,
                              choices=settings.TYPE_TEST_BLOCK,
                              help_text="Статус"
                              )
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
    teacher = models.ForeignKey(get_user_model(),
                                verbose_name=_("учитель"),
                                on_delete=models.SET_NULL,
                                null=True,
                                )
    text = models.TextField(verbose_name='текст вопроса',
                            help_text='Текст вопроса',
                            )
    image = models.ImageField(upload_to=path_maker_question,
                              verbose_name='картинка',
                              help_text='Картинка для вопроса',
                              null=True,
                              blank=True,
                              )
    weight = models.SmallIntegerField(_("вес вопроса"),
                                      validators=[MinValueValidator(1)],
                                      )
    type_question = models.CharField(verbose_name=_('Тип вопроса'),
                                     max_length=8,
                                     choices=settings.TYPE_QUESTION,
                                     default='test',
                                     help_text='Текущий тип данного вопроса',
                                     )
    test_block = models.ForeignKey(TestBlock,
                                   verbose_name=_("тестовый блок"),
                                   on_delete=models.CASCADE,
                                   related_name='questions',
                                   null=True,
                                   blank=True,
                                   )
    check_automaty = models.BooleanField(_("Автоматическая проверка"),
                                         default=False,
                                         help_text="Автоматическая проверка"
                                         )

    def save(self, *args, **kwargs):
        if self.type_question == 'test':
            self.check_automaty = True
        super().save(*args, **kwargs)

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


class UserStory(models.Model):
    """
    Модель представления истории пользователя,
    содержит один из двух типов событий:
    - Ответ на вопрос
    - Прохождение тест блока

    """
    user = models.ForeignKey(get_user_model(),
                             verbose_name=_('Пользователь'),
                             on_delete=models.CASCADE,
                             related_name='user_story',
                             help_text='Пользователь'
                             )
    answer = models.ForeignKey(Answer,
                               verbose_name=_('Ответ'),
                               null=True,
                               blank=True,
                               on_delete=models.CASCADE,
                               related_name='user_story',
                               help_text='Ответ'
                               )

    test_block = models.ForeignKey(TestBlock,
                                   verbose_name=_('Тест блок'),
                                   null=True,
                                   blank=True,
                                   on_delete=models.CASCADE,
                                   related_name='user_story',
                                   help_text='Тест блок'
                                   )
    date_opened = models.DateTimeField(auto_now_add=True,
                                       verbose_name=_('Дата события')
                                       )

    def clean(self):
        UserStoryValidator(answer=self.answer, test_block=self.test_block)()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("User story")
        verbose_name_plural = _("User stories")

    def __str__(self):
        if self.answer:
            return f'{self.user.email} ответ {self.answer.id}'
        return f'{self.user.email} тест {self.test_block.id}'


class LessonStory(models.Model):
    """
    История открытых уроков
    """
    course = models.ForeignKey(Course,
                               verbose_name=_('Курс'),
                               on_delete=models.CASCADE,
                               related_name='lesson_story',
                               help_text='Курс'
                               )
    step = models.ForeignKey(Step,
                             verbose_name=_('Урок'),
                             on_delete=models.CASCADE,
                             related_name='lesson_story'
                             )
    user = models.ForeignKey(get_user_model(),
                             verbose_name=_('Пользователь'),
                             on_delete=models.CASCADE,
                             related_name='lesson_story',
                             help_text='Пользователь'
                             )
    date_opened = models.DateTimeField(_("Дата открытия"),
                                       auto_now_add=True,
                                       help_text="Дата открытия"
                                       )

    def clean(self):
        LessonStoryValidator(course=self.course, step=self.step)()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Lesson story")
        verbose_name_plural = _('Lesson stories')
        unique_together = ('user', 'step')

    def __str__(self):
        return (f"{self.user.email} открыл {self.course.title}"
                f" / Урок {self.lesson.id}")


class AssessmentSubmission(models.Model):
    """
    Модель представления оценки преподавателя
    """
    teacher = models.ForeignKey(get_user_model(),
                                verbose_name=_("Учитель"),
                                on_delete=models.CASCADE,
                                validators=[MinValueValidator(1)],
                                related_name="teacher_assessment",
                                help_text="Учитель")
    test_block = models.ForeignKey(TestBlock,
                                   verbose_name=_("Тест блок"),
                                   on_delete=models.CASCADE,
                                   validators=[MinValueValidator(1)],
                                   help_text="Тест блок"
                                   )
    student = models.ForeignKey(get_user_model(),
                                verbose_name=_("Студент"),
                                on_delete=models.CASCADE,
                                related_name="student_assessment",
                                validators=[MinValueValidator(1)],
                                help_text="Студент"
                                )
    score = models.DecimalField(_("Оценка"),
                                max_digits=5,
                                decimal_places=2,
                                null=True,
                                blank=True,
                                help_text="Введите оценку")
    comment = models.TextField(_("Комментарий"),
                               null=True,
                               blank=True,
                               help_text="Добавить комментарий")
    type_of = models.CharField(_("Выбор типа"),
                               max_length=8,
                               choices=settings.TYPE_OF_ASSESSMENT,
                               help_text="Выбор типа"
                               )
    date_assessment = models.DateTimeField(_("Дата оценки"),
                                           auto_now_add=True,
                                           help_text="Дата оценки")

    class Meta:
        verbose_name = "Оценка преподавателя"
        verbose_name_plural = "Оценки преподавателей"

    def __str__(self):
        return f"Оценка {self.teacher} для {self.student}"


class CourseProgress(models.Model):
    """
    Модель представления прогресса студента в определенной точке курса
    """
    student = models.ForeignKey(get_user_model(),
                                verbose_name=_("Студент"),
                                on_delete=models.CASCADE,
                                validators=[MinValueValidator(1)],
                                related_name="course_progress",
                                help_text="Студент"
                                )
    test_block = models.ForeignKey(TestBlock,
                                   verbose_name=_("Тест блок"),
                                   on_delete=models.CASCADE,
                                   validators=[MinValueValidator(1)],
                                   related_name="course_progress",
                                   help_text="Тест блок"
                                   )
    score = models.DecimalField(_("Балл"),
                                max_digits=5,
                                decimal_places=2,
                                default=0.00,
                                help_text="Балл"
                                )
    data_assessment = models.DateTimeField(_("Успеваемость на момент даты"),
                                           auto_now_add=True,
                                           help_text="Успеваемость на момент"
                                                    " даты"
                                          )
    procent_compelete = models.IntegerField(_("Процент Завершения"),
                                            validators=[MinValueValidator(0),
                                                        MaxValueValidator(100)
                                                        ],
                                            default=0,
                                            help_text="Процент завершения"
                                            )
    result = models.DecimalField(_("Результат"),
                                 max_digits=5,
                                 decimal_places=2,
                                 default=0.00,
                                 help_text="Результат"
                                 )

    class Meta:
        verbose_name = "Прогресс курса"
        verbose_name_plural = "Прогресс курсов"

    def __str__(self):
        return f"Прогресс {self.student} - {self.procent_compelete}%"
