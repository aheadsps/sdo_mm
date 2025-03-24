from typing import TYPE_CHECKING

from django.conf import settings

if TYPE_CHECKING:
    from lessons.models import Question, Course, ContentAttachment


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


def path_maker_content_attachment(instance: 'ContentAttachment', filename: str) -> str:
    """
    Создает корректный путь для сохранения медиа файлов
    в системе.
    """
    text_tranc = instance.content_attachment.title
    return f'content_attachment/{text_tranc}/{filename}'
