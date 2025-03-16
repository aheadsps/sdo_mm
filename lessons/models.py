from django.db import models
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
from django.core.validators import MaxValueValidator, MinValueValidator


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
# Create your models here.
class IntegerRangeField(models.IntegerField):
    """ класс поля модели IntegerField с ограничением по макс и мин заначению"""

    def __init__(self, min_value=None, max_value=None, **kwargs):
        self.validators = [MinValueValidator(min_value),
                           MaxValueValidator(max_value)]
        super().__init__(**kwargs)

class Step(models.Model):
    """
    Шаги урока
    """
    title = models.CharField(max_length=256, null=False, blank=False, verbose_name="Шаг урока")
    content_text = models.TextField(verbose_name="Контент шага урока")
    serial = IntegerRangeField(null=False,
                                 blank=False,
                                 min_value=1,
                                 default=1,
                                 verbose_name="Порядковый номер шага"
                              )
    # media_attachment Медиа вложения. (Только в логике сериализатора, в модели не реализуем!)

    # Тестовый блок для этого шага #/components/schemas/TestBlock
    # test_block = models.OneToOneField(TestBlock, on_delete=models.CASCADE, related_name='step')

    class Meta:
        verbose_name = "Шаг урока"
        verbose_name_plural = "Шаги урока"

    def __str__(self):
        return f"Шаг: {self.title}"