from django.db import models
from django.contrib.auth import base_user


class BaseMode(models.Model):
    title = models.CharField()
