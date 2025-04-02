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
        if not isinstance(element, ET):
            raise ElementTypeError(
                'Ожидался Element',
            )
        self.element = element
        self.prefix = str(prefix)
