#from celery import Celery
from config.settings import CELERY_BROKER_URL
import celery

app = celery.Celery(__name__, broker=CELERY_BROKER_URL)
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()



