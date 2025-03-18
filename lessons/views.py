from rest_framework.viewsets import ModelViewSet
from lessons.serializer import StepSerializer
from lessons.models import Step


# Create your views here.
class StepViewSet(ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer
