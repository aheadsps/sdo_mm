from abc import ABC, abstractmethod


class AbstractTaskManager(ABC):
    """
    Абстрактный Таск менеджер
    """

    @abstractmethod
    def get_settings_task(self): ...

    @abstractmethod
    def create(self): ...

    @abstractmethod
    def update(self): ...

    @abstractmethod
    def delete(self): ...
