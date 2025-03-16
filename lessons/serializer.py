from rest_framework import serializers
from lessons.models import Step


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['serial', 'title', 'content_text']
