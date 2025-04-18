from django.contrib import admin

from lessons import models


@admin.register(models.Answer)
class AnswerAdmin(admin.ModelAdmin):
    """
    Админ панель Ответа
    """

    list_display = (
        "id",
        "text",
        "correct",
        "question",
        )


@admin.register(models.Question)
class QuestionAdmin(admin.ModelAdmin):
    """
    Админ панель Вопроса
    """

    list_display = (
        "id",
        "teacher",
        "text",
        "image",
        "test_block",
        )


@admin.register(models.Step)
class StepAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "teacher",
        "serial",
        "title",
        "content_text",
        "lesson",
    )
    search_fields = ("title",)


@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    """
    Админ панель курса
    """

    list_display = (
        "id",
        'teacher',
        "name",
        "description",
        'interval',
        "beginner",
        "create_date",
        "update_date",
        "image",
        "profession",
        'status',
    )


@admin.register(models.Event)
class EventAdmin(admin.ModelAdmin):
    """
    Админ панель Эвента
    """

    list_display = (
        "id",
        'course',
        'start_date',
        'end_date',
        'status',
        )


@admin.register(models.EventCovered)
class EventCoveredAdmin(admin.ModelAdmin):
    """
    Админ панель покрытия эвента
    """

    list_display = (
        "id",
        'user',
        'event',
        'favorite',
        'procent',
        'status',
    )


@admin.register(models.Lesson)
class LessonAdmin(admin.ModelAdmin):
    """
    Админ панель Урока
    """
    list_display = (
        "id",
        "teacher",
        "name",
        "version",
        "serial",
        "resourse",
        "course",
        "started",
        "start_date",
        "end_date",
        )


@admin.register(models.SCORMFile)
class SCORMFileAdmin(admin.ModelAdmin):
    """
    Админ панель SCORMFile
    """
    list_display = (
        "id",
        'course',
        'name',
        'file',
    )


@admin.register(models.TestBlock)
class TestBlockAdmin(admin.ModelAdmin):
    """
    Админ панель Эвента
    """
    list_display = (
        'id',
        'end_date',
        'max_score',
        'lesson',
        )


@admin.register(models.ContentAttachment)
class AttachmentsAdmin(admin.ModelAdmin):
    """
    Админ для вложеностей
    """
    list_display = ("id", 'file', 'file_type', 'step')


@admin.register(models.UserStory)
class UserStoryAdmin(admin.ModelAdmin):
    """
    Админ панель истории пользователя
    """
    list_display = (
        "id",
        'user',
        'answer',
        'test_block',
        'date_opened',
    )


@admin.register(models.LessonStory)
class LessonStoryAdmin(admin.ModelAdmin):
    """
    Админ панель истории уроков
    """
    list_display = (
        "id",
        'course',
        'step',
        'user',
        'date_opened',
    )
