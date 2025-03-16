from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from lessons.models import Question


def path_maker_text(instance: 'Question', filename: str) -> str:
    """
    Создает корректный путь для сохранения медиа файлов
    в системе.
    """
    text_tranc = instance.text[0:10]
    return f'{text_tranc}/{filename}'
