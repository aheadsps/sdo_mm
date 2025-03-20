from rest_framework.viewsets import ModelViewSet, GenericViewSet, mixins
from lessons.serializers import StepSerializer
from lessons.models import Step
from django.contrib.auth.mixins import (LoginRequiredMixin,
                                        PermissionRequiredMixin)

# Create your views here.
class StepViewSet( ModelViewSet ):
    queryset = Step.objects.all()
    serializer_class = StepSerializer

class StepDetailViewSet( ModelViewSet ):
    queryset = Step.objects.all()
    serializer_class = StepSerializer

    def retrieve(self, request, *args, **kwargs):
        # разрешение для просмотра
        return super(StepDetailViewSet, self).retrieve(request, *args, **kwargs)



