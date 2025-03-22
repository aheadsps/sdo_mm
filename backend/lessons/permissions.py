from rest_framework import permissions
from rest_framework import status
from django.db.models import Q

from lessons import models

from loguru import logger


class IsAdminOrIsStaff(permissions.BasePermission):
    """
    Права доступа и admin и staff
    """
    message = {
        'forbidden': 'Доступ запрещен',
        }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, obj):
        logger.debug(f'user is staff - {request.user.is_staff}')
        logger.debug(f'user is superuser - {request.user.is_superuser}')
        return request.user.is_staff or request.user.is_superuser


class OwnerEventPermission(permissions.BasePermission):
    """
    Права доступа только владельцу
    """
    message = {
        'forbidden': 'Доступ запрещен',
        }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, obj):
        return request.user == obj.user


class CanReadCourse(permissions.BasePermission):
    """
    Права доступа на чтение курса
    """
    message = {
        'forbidden': 'Доступ запрещен',
        }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, course):
        user = request.user
        event = models.Event.objects.filter(Q(user=user) & Q(course=course))
        return (event.exists()
                or (request.user.is_staff
                    or request.user.is_superuser))
