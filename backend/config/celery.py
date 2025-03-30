from celery import Celery
from config.settings import CELERY_BROKER_URL

app = Celery('config', broker=CELERY_BROKER_URL)
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()