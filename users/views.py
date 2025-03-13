from authemail.models import send_multi_format_email

from django.contrib.auth import authenticate

from django.utils.translation import gettext as _

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import LoginSerializer, CustomPasswordChangeSerializer
from users.serializers import PasswordChangeSerializer
from users.serializers import UserSerializer


class Login(APIView):
	permission_classes = (AllowAny,)
	serializer_class = LoginSerializer

	def post(self, request, format=None):
		serializer = self.serializer_class(data=request.data)

		if serializer.is_valid():
			email = serializer.data['email']
			password = serializer.data['password']
			user = authenticate(email=email, password=password)

			if user:
				if user.is_verified:
					if user.is_active:
						token, created = Token.objects.get_or_create(user=user)
						return Response({'token': token.key},
										status=status.HTTP_200_OK)
					else:
						content = {'detail': _('User account not active.')}
						return Response(content,
										status=status.HTTP_401_UNAUTHORIZED)
				else:
					content = {'detail': _('User account not verified.')}
					return Response(content, status=status.HTTP_401_UNAUTHORIZED)
			else:
				content = {'detail': _('Unable to login with provided credentials.')}
				return Response(content, status=status.HTTP_401_UNAUTHORIZED)

		else:
			return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class Logout(APIView):
	permission_classes = (IsAuthenticated,)

	def get(self, request, format=None):
		"""
		Remove all auth tokens owned by request.user.
		"""
		tokens = Token.objects.filter(user=request.user)
		for token in tokens:
			token.delete()
		content = {'success': _('User logged out.')}
		return Response(content, status=status.HTTP_200_OK)


class PasswordChange(APIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = CustomPasswordChangeSerializer

	def post(self, request, format=None):
		serializer = self.serializer_class(data=request.data, context={'request': request})

		if serializer.is_valid():
			user = request.user

			new_password = serializer.data['new_password']
			user.set_password(new_password)
			user.save()

			send_multi_format_email('change_email',
									{'email': user.email, },
									target_email=user.email)

			content = {'success': _('Пароль успешно изменен.')}
			return Response(content, status=status.HTTP_200_OK)

		else:
			return Response(serializer.errors,
							status=status.HTTP_400_BAD_REQUEST)


class UserMe(APIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = UserSerializer

	def get(self, request, format=None):
		return Response(self.serializer_class(request.user).data)
