import xml.etree.ElementTree as ET

from typing import Any, TypeVar


VD = TypeVar("VD", bound=dict[str, Any])
EL = TypeVar('ET', bound=list[ET.Element])
