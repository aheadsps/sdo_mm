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
