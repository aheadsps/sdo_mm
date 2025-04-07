from django.urls import re_path

from . import consumers


websocket_urlpatterns = [
    re_path(r'test-block/(?P<block_id>\d+)$',
            consumers.AnswerCheckerConsumer.as_asgi(),
            ),
]
