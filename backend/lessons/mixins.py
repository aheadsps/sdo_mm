from pathlib import Path

from django.core import checks
from django.conf import settings


class PathModelMixin:
    """
    Миксин создания папки
    """

    def save_form_data(self, instance, data):
        path_scorm = self._get_path_name(self.name)
        path_scorm.mkdir()
        setattr(instance, self.name, data)

    def _check_upload_to(self, path: str):
        if isinstance(path, str) and path.startswith("/"):
            return [
                checks.Error(
                    "%s's 'upload_to' argument must be a relative path, not an "
                    "absolute path." % self.__class__.__name__,
                    obj=self,
                    id="fields.E202",
                    hint="Remove the leading slash.",
                )
            ]
        else:
            return []

    def check(self, **kwargs):
        databases = kwargs.get("databases") or []
        return [
            *super().check(**kwargs),
            *self._check_upload_to(self.name),
            *self._check_db_collation(databases),
            *self._check_max_length_attribute(**kwargs),
        ]

    def _get_path_name(self, path: str) -> Path:
        media_root: Path = Path(settings.MEDIA_ROOT)
        path = media_root.joinpath(path)
        return path
