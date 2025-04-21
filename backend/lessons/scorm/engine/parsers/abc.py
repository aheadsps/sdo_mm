from abc import ABC, abstractmethod


class AbstractParser(ABC):
    """
    Абстрактный парсер
    """

    @abstractmethod
    def parse(self): ...

    @property
    @abstractmethod
    def wrapper(self): ...
