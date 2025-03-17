from rest_framework.permissions import BasePermission
from rest_framework import status


class IsAdminOrIsStaff(BasePermission):
    """
    Права доступа и admin и staff
    """
    message = {
        'forbidden': 'Доступ запрещен',
        }
    code = status.HTTP_403_FORBIDDEN

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or request.user.is_superuser
