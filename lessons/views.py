from rest_framework.viewsets import ModelViewSet
from lessons.serializers import StepSerializer
from lessons.models import Step
from django.contrib.auth.mixins import (LoginRequiredMixin,
                                        PermissionRequiredMixin,
                                        )
from lessons.permissions import CustomPermissionClass

# Create your views here.
class StepViewSet(LoginRequiredMixin,
                  PermissionRequiredMixin,
                  ModelViewSet ):
    """
    Просмотр всех шагов уроков list
    Создание нового шага урока
    """
    queryset = Step._default_manager.all()
    serializer_class = StepSerializer
    permission_required = "lessons.can_change_step"


class StepDetailViewSet(LoginRequiredMixin, ModelViewSet
                        ):
    """
    Просмотр одного шага, Редактирование, удаление шага урока
    """
    queryset = Step._default_manager.all()
    serializer_class = StepSerializer
    permission_classes = [CustomPermissionClass]











