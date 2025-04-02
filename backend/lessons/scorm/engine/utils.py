import os
import re

from django.conf import settings


def is_dir(zipinfo):
    """Return True if this archive member is a directory."""
    if zipinfo.filename.endswith('/'):
        return True
    elif zipinfo.filename.endswith((os.path.sep, settings.OS_PATH_ALT_SEP)):
        return True


def sanitize_input(input_str):
    """
    Для защиты системы удаление всех тэгов scripts
    """
    sanitized_str = re.sub(
        r"<script\b[^>]*>(.*?)</script>", "", input_str, flags=re.IGNORECASE
    )
    return sanitized_str
