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
router.register(prefix=r"events", viewset=views.EventViewSet)
router.register(prefix=r"courses", viewset=views.CourseViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "list_create_test_block/",
        TestBlockListCreateAPIView.as_view(),
        name="list_create_test_block",
    ),
    path(
        "retrieve_update_delete_test_block/<int:pk>/",
        TestBlockRetrieveUpdateDestroyAPIView.as_view(),
        name="retrieve_update_delete_test_block",
    ),
]
