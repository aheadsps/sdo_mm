from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import gettext_lazy as _
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


class Step(models.Model):
    """
    Шаги урока
    """
    title = models.CharField(max_length=256, null=False, blank=False, verbose_name="Шаг урока")
    content_text = models.TextField(verbose_name="Контент шага урока",
                                    null=True,
                                    blank=True,
                                    )
    serial = models.IntegerField(null=False,
                                 blank=False,
                                 default=1,
                                 validators=[MinValueValidator(1)],
                                 verbose_name="Порядковый номер шага"
                                 )

    # Тестовый блок для этого шага #/components/schemas/TestBlock
    # test_block = models.OneToOneField(TestBlock, on_delete=models.CASCADE, related_name='steps')

    class Meta:
        verbose_name = "Шаг урока"
        verbose_name_plural = "Шаги урока"

    def __str__(self):
        return f"Шаг: {self.title}"


TYPE_CONTENT = [
        ("Image", "Изображение"),
        ("Video", "Видео"),
    ]

class ContentAttachment(models.Model):
    file = models.FileField(upload_to ='media/content_step', null=True, blank=True)
    file_type = models.CharField(max_length=10,
                                 choices=TYPE_CONTENT,
                                 default="Image",
                                 verbose_name="Тип файла"
                                )
    content_attachment = models.ForeignKey(Step,
                               unique=False,
                               on_delete=models.CASCADE,
                               related_name='content_attachment'
                               )

    class Meta:
        verbose_name = "Контент для шага урока"
        verbose_name_plural = "Контент для шага урока"

    def __str__(self):
        return self.file

