from rest_framework import serializers

from users import models


class WorkExperienceSerializer(serializers.ModelSerializer):
    """
    Сериализатор стажа работы
    """
    class Meta:
        model = models.WorkExperience
        field = ('id',
                 'years',
                 )


class ProfessionSerializer(serializers.ModelSerializer):
    """
    Сериализатор Профессии
    """

    class Meta:
        model = models.Profession
        field = ('id',
                 'en_name',
                 'ru_name',
                 )
