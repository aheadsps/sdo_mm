from abc import ABC, abstractmethod


class AbstractTaskManaged(ABC):
    """
    Абстрактный Таск менеджер
    """

    @abstractmethod
    def create(self): ...

    @abstractmethod
    def update(self): ...

    @abstractmethod
    def delete(self): ...
