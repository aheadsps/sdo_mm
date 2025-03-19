from rest_framework.viewsets import ModelViewSet, GenericViewSet, mixins
from lessons.serializers import StepSerializer
from lessons.models import Step


# Create your views here.
class StepViewSet(ModelViewSet):
    queryset = Step.objects.all()
    def create(self, request, *args, **kwargs):
        # Обработка записи файла если это POST запрос
        #file_obj = request.FILES['file']
        return  super().create(request, *args, **kwargs )

    serializer_class = StepSerializer

class StepEditViewSet(ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer


