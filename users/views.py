from rest_framework import generics
from users.serializers import BaseModeSerializer
from users.models import BaseMode


class CreateBaseMode(generics.CreateAPIView):
    serializer_class = BaseModeSerializer
    queryset = BaseMode.objects.get_queryset()
