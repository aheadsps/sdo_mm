class DateTimeTypeError(Exception):
    """
    Ошибка не верного типа Datetime
    """

    ...


class TaskDoNotExists(Exception):
    """
    Ошибка не существующей задачи
    """

    ...


class UpdateSettingsNotSet(Exception):
    """
    Ошибка не установленного обновления настроек
    """

    ...
