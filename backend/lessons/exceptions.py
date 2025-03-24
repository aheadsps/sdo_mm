from rest_framework import status
from rest_framework.exceptions import APIException


class UnprocessableEntityError(APIException):
    """
    Исключение на не валидные данные
    """

    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_code = "error"
    default_detail = "Unprocessable_entity"
