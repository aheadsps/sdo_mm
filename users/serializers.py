from rest_framework import serializers
from users.models import BaseMode


class BaseModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseMode
        fields = '__all__'
