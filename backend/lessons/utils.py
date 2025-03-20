from typing import TYPE_CHECKING, Any

from rest_framework.serializers import ModelSerializer

if TYPE_CHECKING:
    from lessons.models import Question, Course


def path_maker_question(instance: 'Question', filename: str) -> str:
    """
    Создает корректный путь для сохранения медиа файлов
    в системе.
    """
    text_tranc = instance.text[0:10]
    return f'question/{text_tranc}/{filename}'


def path_maker_course(instance: 'Course', filename: str) -> str:
    """
    Создает корректный путь для сохранения медиа файлов
    в системе.
    """
    text_tranc = instance.name
    return f'course/{text_tranc}/{filename}'


def get_value(field: str,
              attrs: dict[str, Any],
              serializer: ModelSerializer,
              ) -> Any:
    """Функция выполняющая получение значения
    исходя из того что - пользователь желает изменить поле
    или пользователь просто не указал его
    """
    try:
        value = attrs[field]
    except KeyError:
        if serializer.instance:
            instance = serializer.instance
            field = instance._meta.get_field(field)
            value = field.value_from_object(instance)
        else:
            field = instance.model._meta.get_field(field)
            if field.has_default():
                value = field.default
            else:
                value = None

    return value


def tigger_to_check(attrs: dict[str, Any],
                    *fields: list[str],
                    ) -> bool:
    """Тригер если проверка нужна
    """
    need_check = False
    for field in fields:
        if field in attrs:
            need_check = True
    return need_check
