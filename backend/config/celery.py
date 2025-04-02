#from celery import Celery
from config.settings import CELERY_BROKER_URL
import celery


app = celery.Celery(__name__, broker=CELERY_BROKER_URL)
app.config_from_object('django.conf:settings', namespace='backend')
app.autodiscover_tasks()


# Пусть пока будет тут
@app.task
def create_events() -> None:
    """
    создавать events
    в любом количестве по списку пользователей
    """
    #course_id: int, user_id: list, start_date, end_date
    print("****************")
    import logging
    logger = logging.getLogger('name')

    def hello_reader(request):
        logger.warning('Homepage was accessed at minute!')
