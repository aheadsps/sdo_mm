from authemail.serializers import PasswordChangeSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers


class SignupSerializer(serializers.Serializer):
    """
    Don't require email to be unique so visitor can signup multiple times,
    if misplace verification email.  Handle in view.
    """
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128)
    first_name = serializers.CharField(max_length=30, default='',
                                       required=False)
    last_name = serializers.CharField(max_length=30, default='',
                                      required=False)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128)


class CustomPasswordChangeSerializer(PasswordChangeSerializer):
    old_password = serializers.CharField(required=True, min_length=8, max_length=128)
    new_password = serializers.CharField(required=True, min_length=8, max_length=128)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not authenticate(username=user.email, password=value):
            raise serializers.ValidationError("Старый пароль неверный.")
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'first_name', 'last_name')