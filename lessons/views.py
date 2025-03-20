from rest_framework.viewsets import ModelViewSet, GenericViewSet, mixins
from lessons.serializers import StepSerializer
from lessons.models import Step
from django.contrib.auth.mixins import (LoginRequiredMixin, PermissionRequiredMixin,)
from django.contrib.auth.decorators import permission_required

# Create your views here.
class StepViewSet(LoginRequiredMixin,
                  #PermissionRequiredMixin,
                  ModelViewSet ):
    queryset = Step._default_manager.all()
    serializer_class = StepSerializer
    #permission_required = "lessons.can_change_step"

class StepDetailViewSet(LoginRequiredMixin,
                        ModelViewSet
                        ):
    queryset = Step._default_manager.all()
    serializer_class = StepSerializer

    #permission_required = "lessons.can_change_step"
    def retrieve(self, request, *args, **kwargs):
        # разрешение для просмотра
        #permission_required = False
        return super(StepDetailViewSet, self).retrieve(request, *args, **kwargs)

    @permission_required(perm='lessons.can_change_step')
    def partial_update(self, request, *args, **kwargs):
        #permission_required = 'lessons.can_change_step'
        return super(StepDetailViewSet, self).partial_update(request, *args, **kwargs)

    """
    @permission_required('lessons.can_change_step')
    def update(self, request, *args, **kwargs):
        return super(StepDetailViewSet, self).update(request, *args, **kwargs)"""






