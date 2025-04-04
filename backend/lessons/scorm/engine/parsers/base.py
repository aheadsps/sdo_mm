from django.conf import settings

from lessons.scorm.engine.parsers import AbstractParser
from lessons.scorm.scorm import SCORMLoader
from lessons.scorm.s_types import WrapperCallable


class BaseParser(AbstractParser):
    """
    Базовый парсер
    """

    CONSTRUCTOR_ADAPTER = settings.CONSTRUCTOR_ADAPTER

    def __init__(self,
                 wrapper: SCORMLoader,
                 constructor_type: str,
                 ):
        self._wrapper = wrapper
        self._constructor = self.CONSTRUCTOR_ADAPTER.get(
            constructor_type,
        )

    def parse(self): ...
