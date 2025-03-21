from django.db import models


class TestBlock(models.Model):
    description = models.TextField(verbose_name="описание")
    lessons = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name="test_block_lessons")

    class Meta:
        verbose_name = "тестовый блок"
        verbose_name_plural = "тестовые блоки"
        ordering = ["lessons"]
