from django.urls import include, path
from rest_framework import routers

from lessons import views
from lessons.apps import LessonsConfig

app_name = LessonsConfig.name

router = routers.SimpleRouter(
    trailing_slash=False,
)
router.register(prefix=r'events', viewset=views.EventViewSet)
router.register(prefix=r'step', viewset=views.StepViewSet)
router.register(prefix=r'courses', viewset=views.CourseViewSet)
router.register(prefix=r'lessons', viewset=views.LessonViewSet)
router.register(prefix=r'test-block', viewset=views.TestBlockViewSet)
router.register(prefix=r'questions', viewset=views.QuestionViewSet)
router.register(prefix=r'answers', viewset=views.AnswerViewSet)
router.register(prefix=r'scorms', viewset=views.SCROMViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
