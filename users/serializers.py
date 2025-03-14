from authemail.serializers import PasswordChangeSerializer, UserSerializer, LoginSerializer, SignupSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers

from users.models import User


class CustomPasswordChangeSerializer(serializers.Serializer):
    """
    Кастомный сериализатор для изменения пароля пользователя.
    Проверяет старый пароль и устанавливает новый.
    """

    old_password = serializers.CharField(required=True, min_length=8, max_length=128)
    new_password = serializers.CharField(required=True, min_length=8, max_length=128)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not authenticate(username=user.email, password=value):
            raise serializers.ValidationError("Старый пароль неверный.")
        return value


class CustomUserSerializer(UserSerializer):
    """
    Кастомный сериализатор для модели User.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'profession', 'date_commencement']
        read_only_fields = ['id', 'is_staff', 'is_active', 'date_joined', 'last_login']