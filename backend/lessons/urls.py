from django.urls import include, path
from rest_framework import routers

from lessons import views
from lessons.apps import LessonsConfig

app_name = LessonsConfig.name

router = routers.SimpleRouter(
    trailing_slash=False,
)
router.register(prefix=r'events', viewset=views.EventViewSet)
router.register(prefix=r'courses', viewset=views.CourseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test-block/<int:block_id>',
         view=views.TestBlockGeneric.as_view(),
         name='test_block')
]
