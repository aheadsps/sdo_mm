from rest_framework.viewsets import ModelViewSet, GenericViewSet, mixins
from lessons.serializers import StepSerializer, StepEditSerializer
from lessons.models import Step


# Create your views here.
class StepViewSet(ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer

class StepEditViewSet(ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer


