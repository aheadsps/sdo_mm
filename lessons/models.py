from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


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
    # media_attachment Медиа вложения. (Только в логике сериализатора, в модели не реализуем!)

    # Тестовый блок для этого шага #/components/schemas/TestBlock
    # test_block = models.OneToOneField(TestBlock, on_delete=models.CASCADE, related_name='steps')

    class Meta:
        verbose_name = "Шаг урока"
        verbose_name_plural = "Шаги урока"

    def __str__(self):
        return f"Шаг: {self.title}"