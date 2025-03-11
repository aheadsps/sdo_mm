from django.urls import path
from users.apps import UsersConfig
from users.views import CreateBaseMode


app_name = UsersConfig.name

urlpatterns = [
    path(
        'api/base/mode',
        CreateBaseMode.as_view(),
        name='mode_create',
    )
]
