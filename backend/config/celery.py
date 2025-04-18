from config.settings import CELERY_BROKER_URL
from celery import Celery
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery(__name__, broker=CELERY_BROKER_URL)
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(['lessons'])
app.conf.timezone = "Europe/Moscow"
