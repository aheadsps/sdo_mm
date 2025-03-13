from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from users import views

from users.apps import UsersConfig

app_name = UsersConfig.name

urlpatterns = [
    path('login', views.Login.as_view(), name='users-login'),

    path('logout', views.Logout.as_view(), name='users-logout'),

    path('settings/password/change', views.PasswordChange.as_view(),
         name='users-password-change'),

    path('profile', views.UserMe.as_view(), name='users-me'),
]


urlpatterns = format_suffix_patterns(urlpatterns)