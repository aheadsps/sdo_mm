from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from loguru import logger

from lessons import models
from lessons import serializers
from lessons import viewsets as own_viewsets
from lessons.permissions import IsAdminOrIsStaff


class EventViewSet(own_viewsets.GetUpdateDeleteViewSet):
    """
    Виювсет эвента
    """
    queryset = models.Event._default_manager.get_queryset()
    serializer_class = serializers.EventSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'event_id'
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        logger.debug(f'action is {self.action}')
        if self.action == 'retrieve' or self.action == 'currents':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminOrIsStaff]
        logger.debug(f'permisson class now {permission_classes}')
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        self.serializer_class = serializers.EventSerializerCreate
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False)
    def currents(self, request):
        """
        Получение текущих эвентов на пользователя
        """
        user = request.user
        queryset = self.filter_queryset(self.get_queryset())
        events = queryset.filter(user=user)
        page = self.paginate_queryset(events)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
