from abc import ABC, abstractmethod


class AbstractCore(ABC):
    """
    Астрактрый класс для назначение протокола
    """

    @property
    @abstractmethod
    def manifest(self): ...

    @property
    @abstractmethod
    def meta(self): ...

    @property
    @abstractmethod
    def organizations(self): ...

    @property
    @abstractmethod
    def resources(self): ...

    @abstractmethod
    def save(self): ...

    @abstractmethod
    def delete(self): ...
