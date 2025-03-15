from django.contrib import admin
from lessons import models


@admin.register(models.Answer)
class AnswerAdmin(admin.ModelAdmin):
    """
    Админ панель Ответа
    """
    list_display = ('text', 'correct', 'question')
