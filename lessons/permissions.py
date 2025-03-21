from django.contrib.auth.decorators import permission_required
from rest_framework import permissions

class CustomPermissionClass(permissions.BasePermission):
    """
    "lessons.can_change_step"

    """
    #def is_authenticated(self, request):
    #    return request.user and is_authenticated(request.user)

    def has_permission(self, request, view):
        if view.action == 'create':  # create new user by anyone
            return True

        if  view.action == 'destroy':
            #if has_permission
            print("*****",request.user.has_perms("lessons.can_change_step"))
            return True

        if view.action == 'partial_update':
            # if has_permission
            print("*****", request.user.has_perms( "lessons.can_change_step1"))
            return True

        # add all other conditions you want to implement
        return False  # default case