from django.urls import include, path
from rest_framework import routers

from lessons import views
from lessons.apps import LessonsConfig
from lessons.views import (TestBlockListCreateAPIView,
                                   TestBlockRetrieveUpdateDestroyAPIView)

app_name = LessonsConfig.name

router = routers.SimpleRouter(
    trailing_slash=False,
)
router.register(prefix=r'events', viewset=views.EventViewSet)
router.register(prefix=r'step', viewset=views.StepViewSet)
router.register(prefix=r'courses', viewset=views.CourseViewSet)
router.register(r'lessons', viewset=views.LessonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
