from authemail.serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers
from users import models


class CustomLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128)


class CustomPasswordChangeSerializer(serializers.Serializer):
    """
    Кастомный сериализатор для изменения пароля пользователя.
    Проверяет старый пароль и устанавливает новый.
    """

    old_password = serializers.CharField(required=True, min_length=8, max_length=128)
    new_password = serializers.CharField(required=True, min_length=8, max_length=128)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not authenticate(username=user.email, password=value):
            raise serializers.ValidationError("Старый пароль неверный.")
        return value


class ProfileSerializer(serializers.ModelSerializer):
    """Сериализатор для модели UserInfo"""

    class Meta:
        model = models.Profile
        fields = [
            "phone",
            "image",
            "date_birthday",
        ]


class CustomUserSerializer(UserSerializer):
    """Сериализатор для модели User."""

    profile = ProfileSerializer()

    class Meta:
        model = models.User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "date_commencement",
            "profession",
            "profile",
        ]
        read_only_fields = [
            "id",
            "is_staff",
            "is_active",
            "date_joined",
        ]


class WorkExperienceSerializer(serializers.ModelSerializer):
    """
    Сериализатор стажа работы
    """

    class Meta:
        model = models.WorkExperience
        fields = (
            "id",
            "years",
        )


class ProfessionSerializer(serializers.ModelSerializer):
    """
    Сериализатор Профессии
    """

    class Meta:
        model = models.Profession
        fields = (
            "id",
            "en_name",
            "ru_name",
        )
