from authemail.views import PasswordChange, Logout, UserMe, Login

from django.contrib.auth import authenticate

from django.utils.translation import gettext as _

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from users.serializers import LoginSerializer, CustomPasswordChangeSerializer, CustomUserSerializer
from users.utils import custom_send_multi_format_email


class CustomLogin(Login):
	""" Кастомный класс для входа пользователя. """
	permission_classes = (AllowAny,)
	serializer_class = LoginSerializer

	def post(self, request, format=None):
		""" Обрабатывает POST-запрос для изменения пароля пользователя. """
		# Валидация данных
		serializer = self.serializer_class(data=request.data)

		if serializer.is_valid():
			email = serializer.data['email']
			password = serializer.data['password']
			user = authenticate(email=email, password=password)

			if user:
				if user.is_verified:
					if user.is_active:
						token, created = Token.objects.get_or_create(user=user)
						return Response({'token': token.key}, status=status.HTTP_200_OK)
					else:
						content = {'detail': _('User account not active.')}
						return Response(content, status=status.HTTP_401_UNAUTHORIZED)
				else:
					content = {'detail': _('User account not verified.')}
					return Response(content, status=status.HTTP_401_UNAUTHORIZED)
			else:
				content = {'detail': _('Unable to login with provided credentials.')}
				return Response(content, status=status.HTTP_401_UNAUTHORIZED)

		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomLogout(Logout):
	""" Кастомный класс для выхода пользователя. """
	permission_classes = (IsAuthenticated,)

	def get(self, request, format=None):
		"""Обрабатывает GET-запрос для выхода пользователя."""
		tokens = Token.objects.filter(user=request.user)
		for token in tokens:
			token.delete()
		content = {'success': _('Юзер вышел из профиля.')}
		return Response(content, status=status.HTTP_200_OK)


class CustomPasswordChange(PasswordChange):
	""" Кастомный класс для изменения пароля пользователя. """
	permission_classes = (IsAuthenticated,)
	serializer_class = CustomPasswordChangeSerializer

	def post(self, request, format=None):
		""" Обрабатывает POST-запрос для изменения пароля пользователя. """
		serializer = self.serializer_class(data=request.data, context={'request': request})

		if serializer.is_valid():
			user = request.user

			new_password = serializer.data['new_password']
			user.set_password(new_password)
			user.save()

			custom_send_multi_format_email('change_password',
										   {'email': user.email, },
										   target_email=user.email)

			content = {'success': _('Пароль успешно изменен.')}
			return Response(content, status=status.HTTP_200_OK)

		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomUserMe(UserMe):
	permission_classes = (IsAuthenticated,)
	serializer_class = CustomUserSerializer

	def get(self, request, format=None):
		return Response(self.serializer_class(request.user).data)
