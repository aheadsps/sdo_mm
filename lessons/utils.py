from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from lessons.models import Answer


def path_maker_text(instance: 'Answer', filename: str) -> str:
    """
    Создает корректный путь для сохранения медиа файлов
    в системе.
    """
    question_id = instance.pk
    text_tranc = instance.text[0:10]
    return f'{text_tranc}/question_{question_id}/{filename}'
