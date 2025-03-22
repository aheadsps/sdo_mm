from rest_framework.routers import DefaultRouter

from TestBlock.apps import TestblockConfig
from TestBlock.views import TestBlockViewSet

app_name = TestblockConfig.name

router = DefaultRouter()
router.register(r"test_block", TestBlockViewSet.as_view(), basename="test_block")

urlpatterns = [] + router.urls
