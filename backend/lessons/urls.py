from django.urls import include, path
from rest_framework import routers

from lessons import views
from lessons.apps import LessonsConfig

app_name = LessonsConfig.name

router = routers.SimpleRouter(
    trailing_slash=False,
)
router.register(prefix=r'events', viewset=views.EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
