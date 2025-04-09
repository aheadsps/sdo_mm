from typing import TypeVar, Generic


EL = TypeVar('EL')


class DataSetCore(Generic[EL]):
    """
    DTO для взаимодействия с элементами
    """

    def __init__(self,
                 element: EL,
                 prefix: str,
                 ):
        self._element = element
        self.prefix = str(prefix)

    @property
    def element(self) -> EL:
        return self._element

    def __getitem__(self, index: str) -> list[EL]:
        index_p = self.prefix + str(index)
        element = self._element.find(index_p)
        if element is None:
            element = self._element.findall(index_p)
            if element:
                element = [
                    DataSetCore[EL](
                        element=el,
                        prefix=self.prefix,
                        )
                    for el
                    in element]
        else:
            element = [
                DataSetCore[EL](
                    element=element,
                    prefix=self.prefix,
                    )
                ]
        return element

    def __repr__(self):
        return f'<{self.__class__.__name__} {self.element}>'
