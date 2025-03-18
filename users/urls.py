from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns


from users.apps import UsersConfig
from users.views import CustomLogin, CustomLogout, CustomPasswordChange, CustomUserMe

app_name = UsersConfig.name

urlpatterns = [
    path('login', CustomLogin.as_view(), name='users-login'),

    path('logout', CustomLogout.as_view(), name='users-logout'),

    path('settings/password/change', CustomPasswordChange.as_view(),
         name='users-password-change'),

    path('profile', CustomUserMe.as_view(), name='user-profile'),
]


urlpatterns = format_suffix_patterns(urlpatterns)

