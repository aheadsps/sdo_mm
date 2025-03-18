from django.contrib import admin
from lessons.models import Step
# Register your models here.
<<<<<<< HEAD
from lessons import models


@admin.register(models.Answer)
class AnswerAdmin(admin.ModelAdmin):
    """
    Админ панель Ответа
    """
    list_display = ('text', 'correct', 'question')


@admin.register(models.Question)
class QuestionAdmin(admin.ModelAdmin):
    """
    Админ панель Вопроса
    """
    list_display = ('text', 'image')
=======
>>>>>>> 7a9248ad427ac3033f9e399e87141c05c04ca908

@admin.register(Step)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "serial",
        "title",
    )
    search_fields = (
        "title",
    )
