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
        self.element = element
        self.prefix = str(prefix)

    def __getitem__(self, index: str) -> list[ET.Element]:
        index_p = self.prefix + str(index)
        element = self.element.find(index_p)
        if element is None:
            element = self.element.findall(index_p)
        else:
            element = [element]
        return element

    def __repr__(self):
        return f'<{self.__class__.__name__} {self.element}>'
