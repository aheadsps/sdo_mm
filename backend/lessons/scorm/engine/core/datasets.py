import xml.etree.ElementTree as ET

from lessons.scorm.engine.exceptions import ElementTypeError


class DataSetCore:
    """
    DTO для взаимодействия с элементами
    """

    def __init__(self,
                 element: ET.Element,
                 prefix: str,
                 ):
        if not isinstance(element, ET.Element):
            raise ElementTypeError(
                'Ожидался Element',
            )
        self._element = element
        self.prefix = str(prefix)

    @property
    def element(self) -> ET.Element:
        return self._element

    def __getitem__(self, index: str) -> list['DataSetCore']:
        index_p = self.prefix + str(index)
        element = self._element.find(index_p)
        if element is None:
            element = self._element.findall(index_p)
            if element:
                element = [
                    DataSetCore(
                        element=el,
                        prefix=self.prefix,
                        )
                    for el
                    in element]
        else:
            element = [
                DataSetCore(
                    element=element,
                    prefix=self.prefix,
                    )
                ]
        return element

    def __repr__(self):
        return f'<{self.__class__.__name__} {self.element}>'
