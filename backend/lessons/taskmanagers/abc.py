from abc import ABC, abstractmethod


class AbstractTaskManager(ABC):
    """
    Абстрактный Таск менеджер
    """

    @property
    @abstractmethod
    def settings(self, **kwargs): ...

    @abstractmethod
    def update_settings(self): ...

    @abstractmethod
    def create(self): ...

    @abstractmethod
    def update(self): ...

    @abstractmethod
    def delete(self): ...
