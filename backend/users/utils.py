import random
import string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string


def generate_random_password(length=12):
    """
    Генерирует случайный пароль, состоящий из букв и цифр.
    :param length: Длина пароля (по умолчанию 12 символов).
    :return: Случайный пароль.
    """
    # Создаем строку с буквами разного регистра и цифрами.
    characters = string.ascii_letters + string.digits
    # Генерируем пароль, выбирая случайные символы из строки characters
    password = ''.join(random.choice(characters) for _ in range(length))
    # Возвращаем сгенерированный пароль
    return password


def custom_send_multi_format_email(template_prefix, template_ctxt,
                                   target_email):
    """
    Отправляет email с использованием шаблонов.
    :param template_prefix: Префикс шаблона (например, 'welcome_email').
    :param template_ctxt: Контекст для шаблона.
    :param target_email: Email получателя.
    """
    # Формируем пути к файлам
    subject_file = 'users/%s_subject.txt' % template_prefix
    txt_file = 'users/%s.txt' % template_prefix
    html_file = 'users/%s.html' % template_prefix

    # Рендерим тему письма из шаблона и удаляем лишние пробелы
    subject = render_to_string(subject_file).strip()
    # Получаем email отправителя из настроек Django
    from_email = settings.EMAIL_FROM
    # Указываем email получателя
    to = target_email
    # Получаем email для скрытой копии (BCC) из настроек Django
    bcc_email = settings.EMAIL_BCC
    # Рендерим текстовое и html содержимое письма, подставляя контекст в шаблон
    text_content = render_to_string(txt_file, template_ctxt)
    html_content = render_to_string(html_file, template_ctxt)
    # Создаем объект письма с текстовым и HTML-содержимым
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to],
                                 bcc=[bcc_email])
    # Добавляем HTML-содержимое как альтернативу
    msg.attach_alternative(html_content, 'text/html')
    # Отправляем письмо
    msg.send()
