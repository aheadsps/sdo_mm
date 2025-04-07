from django.db.models import Q
from loguru import logger
from rest_framework import permissions, status

from lessons import models


class IsAdminOrIsStaff(permissions.BasePermission):
    """
    Права доступа и admin и staff
    """

    message = {
        "forbidden": "Доступ запрещен",
    }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, obj):
        logger.debug(f"user is staff - {request.user.is_staff}")
        logger.debug(f"user is superuser - {request.user.is_superuser}")
        return request.user.is_staff or request.user.is_superuser


class OwnerEventPermission(permissions.BasePermission):
    """
    Права доступа только владельцу
    """

    message = {
        "forbidden": "Доступ запрещен",
    }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, obj):
        return request.user == obj.user


class CanReadCourse(permissions.BasePermission):
    """
    Права доступа на чтение курса
    """

    message = {
        "forbidden": "Данный курс не доступен",
    }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, course):
        if not course:
            return
        user = request.user
        event = models.Event.objects.filter(Q(user=user) & Q(course=course))
        return event.exists()


class CanReadLesson(permissions.BasePermission):
    """
    Права доступа на чтение урока
    """
    message = {
        'forbidden': 'Данный урок не доступен',
    }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, lesson):
        if not lesson:
            return

        user = request.user

        event_exists = models.Event.objects.filter(
            Q(user=user) &
            Q(course=lesson.course)
        )

        return event_exists.exists()


class CanReadStep(permissions.BasePermission):
    """
    Права доступа на просмотр Шага
    """

    message = {
        'forbidden': 'Данный урок не доступен',
    }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, step):
        if not step or not step.lesson or not step.lesson:
            return

        user = request.user

        event_exists = models.Event.objects.filter(
            Q(user=user) &
            Q(course=step.lesson.course)
        )

        return event_exists.exists()


class CanReadBlock(permissions.BasePermission):
    """
    Права доступа на просмотр Тестового блока
    """

    message = {
        'forbidden': 'Данный урок не доступен',
    }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, test_block):
        if not test_block:
            return

        user = request.user

        event_exists = models.Event.objects.filter(
            Q(user=user) &
            Q(course=test_block.lesson.course)
        )

        return event_exists.exists()


class CanReadUserStory(permissions.BasePermission):
    """
    Права доступа на чтение истории пользователя
    """
    message = {
        "forbidden": "Доступ к истории пользователя запрещен",
    }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, user_story):
        if not user_story:
            return False

        user = request.user

        if user.is_staff or user.is_superuser:
            return True

        return user == user_story.user


class CanReadLessonStory(permissions.BasePermission):
    """
    Права доступа на чтение истории уроков
    """
    message = {
        "forbidden": "Доступ к истории уроков запрещен",
    }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, lesson_story):
        if not lesson_story:
            return False

        user = request.user

        if user.is_staff or user.is_superuser:
            return True

        if user != lesson_story.user:
            return False

        event_exists = models.Event.objects.filter(
            Q(user=user) &
            Q(course=lesson_story.course)
        )

        return event_exists.exists()