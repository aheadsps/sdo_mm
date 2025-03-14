from authemail.forms import EmailUserCreationForm

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.utils.translation import gettext as _
from .utils import generate_random_password, custom_send_multi_format_email


class CustomUserCreationForm(EmailUserCreationForm):
    """
    Форма для создания пользователя в админке.
    Пароль генерируется автоматически и отправляется на email пользователя.
    """

    password1 = None
    password2 = None

    date_commencement = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}),
        label=_('Дата начала')
    )

    class Meta:
        model = get_user_model()
        fields = ('email', 'date_commencement')

    def clean_email(self):
        """
        Проверяет, что email уникален.
        """
        email = self.cleaned_data.get('email')
        try:
            get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            return email
        raise forms.ValidationError(_('Пользователь с таким email уже существует.'))

    def save(self, commit=True):
        """
        Сохраняет пользователя с автоматически сгенерированным паролем.
        Пароль отправляется на email пользователя.
        """
        # Генерируем случайный пароль
        random_password = generate_random_password()

        # Создаем пользователя без пароля
        user = super(EmailUserCreationForm, self).save(commit=False)

        # Устанавливаем сгенерированный пароль
        user.set_password(random_password)

        # Устанавливаем поле date_commencement
        user.date_commencement = self.cleaned_data['date_commencement']

        # Автоматически верифицируем пользователя
        user.is_verified = True

        # Сохраняем пользователя, если commit=True
        if commit:
            user.save()

            # Добавляем пользователя в группу "User"
            try:
                user_group = Group.objects.get(name="User")
            except Group.DoesNotExist:
                # Если группа "User" не существует, создаем её
                user_group = Group.objects.create(name="User")
            user.groups.add(user_group)

        # Отправляем email с паролем
        custom_send_multi_format_email(
            'welcome_email',  # Шаблон email
            {'email': user.email, 'password': random_password},  # Контекст для шаблона
            target_email=user.email  # Email получателя
        )

        return user
