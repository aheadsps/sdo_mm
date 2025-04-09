class SCORMExtractError(Exception):
    """
    Ошибка извлечения SCORM
    """

    ...


class ManifestNotSetupError(Exception):
    """
    Ошибка отсутствия манифеста
    """

    ...


class ElementTypeError(Exception):
    """
    Ошибка типа элемента
    """

    ...
