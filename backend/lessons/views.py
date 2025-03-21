from rest_framework import generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from lessons import models
from lessons import serializers
from lessons import viewsets as own_viewsets
from lessons.permissions import IsAdminOrIsStaff, CustomPermissionClass

from django.contrib.auth.mixins import (LoginRequiredMixin,
                                        PermissionRequiredMixin,
                                        )

class EventViewSet(own_viewsets.GetUpdateDeleteViewSet):
    """
    Виювсет эвента
    """
    queryset = models.Event._default_manager.get_queryset()
    serializer_class = serializers.EventSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'event_id'

    def get_permissions(self):
        if not self.action == 'retrieve':
            permission_classes = [IsAdminOrIsStaff]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, permission_classes=[permissions.IsAuthenticated])
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


class StepViewSet(LoginRequiredMixin,
                  PermissionRequiredMixin,
                  ModelViewSet ):
    """
    Просмотр всех шагов уроков list
    Создание нового шага урока
    """
    queryset = models.Step._default_manager.all()
    serializer_class = serializers.StepSerializer
    permission_required = "lessons.can_change_step"


class StepDetailViewSet(LoginRequiredMixin, ModelViewSet
                        ):
    """
    Просмотр одного шага, Редактирование, удаление шага урока
    """
    queryset = models.Step._default_manager.all()
    serializer_class = serializers.StepSerializer
    permission_classes = [CustomPermissionClass]