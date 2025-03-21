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
    # url: step/ только list и create
    path('', views.StepViewSet.as_view({'get':'list',
                                  'post':'create'}),
                                    name='step'),
    # url: step/[0-9]+ retrieve partial_update destroy
    path('<int:pk>/', views.StepDetailViewSet.as_view({'get':'retrieve',
                                               'patch':'partial_update',
                                               'delete':'destroy'
                                               }),name='step_detail'),
]
