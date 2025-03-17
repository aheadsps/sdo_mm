from rest_framework import generics, viewsets, permissions

from lessons import models
from lessons import serializers
from lessons import viewsets as own_viewsets
from lessons.permissions import IsAdminOrIsStaff


class EventViewSet(own_viewsets.GetUpdateDeleteViewSet):
    """
    Виювсет эвента
    """
    models = models.Event._default_manager.get_queryset()
    serializers = serializers.EventSerializer

    def get_permissions(self):
        if not self.action == 'retrieve':
            permission_classes = [IsAdminOrIsStaff]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
