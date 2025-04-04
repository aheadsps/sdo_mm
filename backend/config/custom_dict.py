from typing import ClassVar
from types import MappingProxyType
from collections import UserDict


class ConstructorDict(UserDict):
    """
    Специальный новый тип словаря
    для конструктора
    """

    DEFAULT_DATA = MappingProxyType(dict(default='res/data-1.json'))
    DEFAULT_KEY: ClassVar[str] = 'default'

    def get(self, key, default=None):
        try:
            return self[key]
        except KeyError:
            return self.DEFAULT_DATA[self.DEFAULT_KEY]

    def __contains__(self, key):
        return key in self.keys()
