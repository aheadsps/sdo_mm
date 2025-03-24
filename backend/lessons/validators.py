from lessons import exceptions


class MoreThanZeroValidator:
    """
    Валидатор на проверку нумерации int >= 1
    """

    requires_context = True

    def __init__(self, serial: str) -> None:
        self.serial = serial

    def __call__(self, serial, serializer_field):
        """
        Проверка корректности serial >= 1
        """
        if serializer_field.initial_data.get(self.serial) < 1:
            raise exceptions.UnprocessableEntityError(
                dict(serial="Не может быть меньше 1")
            )
