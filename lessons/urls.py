"""
URL configuration for config project.
"""
from lessons import views
from rest_framework import routers
from django.urls import path
from lessons.views import StepViewSet, StepEditViewSet

app_name = "lessons"

urlpatterns = [
    # url: step/ только list и create
    path('', StepViewSet.as_view({'get':'list',
                                  'post':'create'}),
                                    name='step'),
    # url: step/[0-9]+ retrieve partial_update destroy
    path('<int:pk>/', StepEditViewSet.as_view({'get':'retrieve',
                                               'patch':'partial_update',
                                               'delete':'destroy'
                                               }),name='step_detail'),
]




