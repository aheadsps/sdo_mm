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


class CustomPermissionClass(BasePermission):
    """
    "lessons.can_change_step"

    """
    def has_permission(self, request, view):
        if view.action == 'retrieve':  # create new user by anyone
            return True

        if  view.action == 'destroy':
            if request.user.has_perms(["lessons.can_change_step", ]):
                return True

        if view.action == 'partial_update':
            if request.user.has_perms(["lessons.can_change_step",]):
                return True
        return False