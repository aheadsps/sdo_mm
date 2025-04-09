import os
import zipfile

from typing import Protocol, runtime_checkable


@runtime_checkable
class ParserCallable(Protocol):
    """
    Протокол парсера
    """
    def parse(self): ...


@runtime_checkable
class WrapperCallable(Protocol):
    """
    Протокол обвертки
    """
    def open(self, path: os.PathLike) -> zipfile.ZipExtFile: ...

    def entrypoint(self, parser: ParserCallable) -> None: ...
