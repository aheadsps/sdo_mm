from lessons.scorm.engine.parsers import AbstractParser
from lessons.scorm.s_types import WrapperCallable


class BaseParser(AbstractParser):
    """
    Базовый парсер
    """

    def __init__(self,
                 wrapper: WrapperCallable,
                 ):
        self._wrapper = wrapper
