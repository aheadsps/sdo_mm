from django.contrib.auth.decorators import permission_required
from rest_framework import permissions

class CustomPermissionClass(permissions.BasePermission):
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