import zipfile

from django.core.files.base import ContentFile

from lessons.scorm.engine.utils import is_dir
from lessons.models import SCORM, SCORMFile
from .base import BaseSCORMCore


class CoreSCORM(BaseSCORMCore):
    """
    Ядро работы конструктора SCORM

    `Внутренее устроиство:`
    - Получение JSON файла структуры

    `Пример использования:`

    ```python
    with zipfile.ZipFile(zip_file_path) as file:
            scorm = CoreSCORM(zip_file=file)

    scorm.resources['file']
    scorm.save()
    ```
    """

    def __init__(self,
                 zip_file: zipfile.ZipFile,
                 ):
        super().__init__(zip_file)
        self._structures: list[tuple[str, str], str] | None = None

    @property
    def structures(self):
        return self._structures

    def _get_structures(self, index):
        ...

    def save(self) -> SCORM:
        """
        Сохранение курса в систему
        """
        root_path = self._get_root_path(
            zip_infos=self._infos,
        )
        title = self._get_name_course(prefix=self.prefix)
        scorm_lesson = SCORM._default_manager.create(
            name=title,
            )
        list_files = []
        for zipinfo in self._infos:
            if zipinfo.filename.startswith(root_path):
                if not is_dir(zipinfo):
                    list_files.append(SCORMFile(
                        scorm=scorm_lesson,
                        file=ContentFile(self._file.read(zipinfo.filename),
                                         zipinfo.filename,),
                        ))
        SCORMFile._default_manager.bulk_create(list_files)
        return scorm_lesson
