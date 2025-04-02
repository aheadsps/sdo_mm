from lessons.scorm.engine.parsers import AbstractParser


class BaseParser(AbstractParser):
    """
    Базовый парсер
    """

    def __init__(self,
                 wrapper):
        super().__init__()