"""
URL configuration for config project.
"""
from lessons import views
from rest_framework import routers


router_lessons = routers.DefaultRouter()
router_lessons.register(r'step', views.StepViewSet, basename='step')
print(router_lessons.urls)


