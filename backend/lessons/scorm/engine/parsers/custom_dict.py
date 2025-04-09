from typing import ClassVar
from types import MappingProxyType
from collections import UserDict

from .parsers import IspringParser


class ConstructorDict(UserDict):
    """
    Специальный новый тип словаря
    для конструктора
    """

    DEFAULT_DATA = MappingProxyType(dict(default=IspringParser))
    DEFAULT_KEY: ClassVar[str] = 'default'

    def get(self, key, default=None):
        try:
            return self[key]
        except KeyError:
            return self.DEFAULT_DATA[self.DEFAULT_KEY]

    def __contains__(self, key):
        return key in self.keys()
