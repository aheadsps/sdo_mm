import os

from django.conf import settings


def is_dir(zipinfo):
    """Return True if this archive member is a directory."""
    if zipinfo.filename.endswith('/'):
        return True
    elif zipinfo.filename.endswith((os.path.sep, settings.OS_PATH_ALT_SEP)):
        return True
