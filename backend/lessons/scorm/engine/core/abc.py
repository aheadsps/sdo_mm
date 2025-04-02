from abc import ABC, abstractmethod


class AbstractCore(ABC):
    """
    Астрактрый класс для назначение протокола
    """

    @abstractmethod
    def save(self): ...
