from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import (CreateAPIView,
                                     ListAPIView,
                                     RetrieveAPIView,
                                     UpdateAPIView,
                                     DestroyAPIView
                                     )
from lessons.serializer import StepSerializer
from lessons.models import Step


# Create your views here.
class StepViewSet(ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer


"""class StepCreateViewSet(CreateAPIView):
    queryset = Step.objects.all()
    serializer_class = StepSerializer


class StepListViewSet(ListAPIView):
        queryset = Step.objects.all()
        serializer_class = StepSerializer


class StepDetailViewSet(RetrieveAPIView):
        queryset = Step.objects.all()
        serializer_class = StepSerializer


class StepUpdateViewSet(UpdateAPIView):
        queryset = Step.objects.all()
        serializer_class = StepSerializer


class StepDeleteViewSet(DestroyAPIView):
        queryset = Step.objects.all()
        serializer_class = StepSerializer"""