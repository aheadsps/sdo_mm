from django.contrib import admin
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


@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    """
    Админ панель курса
    """
    list_display = (
        'name',
        'description',
        'beginer',
        'create_date',
        'update_date',
        'image',
        'profession',
        )


@admin.register(models.Event)
class EventAdmin(admin.ModelAdmin):
    """
    Админ панель Эвента
    """
    list_display = (
        'user',
        'course',
        'done_lessons',
        'start_date',
        'end_date',
        'favorite',
        'status',
        )


@admin.register(models.TestBlock)
class TestBlockAdmin(admin.ModelAdmin):
    """
    Админ панель Эвента
    """
    list_display = ('id',)
