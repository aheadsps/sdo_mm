from abc import ABC, abstractmethod


class AbstractCore(ABC):

    @abstractmethod
    def save(self): ...
