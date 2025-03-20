from datetime import timedelta

from authemail.forms import EmailUserCreationForm

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext as _

from .models import Profile
from .utils import generate_random_password, custom_send_multi_format_email

MAX_WORK_EXPERIENCE_YEARS = 60


class CustomUserCreationForm(EmailUserCreationForm):
    """
    Форма для создания пользователя в админке.
    Пароль генерируется автоматически и отправляется на email пользователя.
    """

    password1 = None
    password2 = None

    date_commencement = forms.DateField(
        required=True,
        widget=forms.DateInput(attrs={'type': 'date'}),
        label=_('Дата начала')
    )

    class Meta:
        model = get_user_model()
        fields = ('email', 'date_commencement', "profession")

    def clean_email(self):
        """
        Проверяет, что email уникален.
        """
        try:
            return super().clean_email()
        except forms.ValidationError:
            raise forms.ValidationError(
                _('Пользователь с таким email уже существует.'))

    def clean_date_commencement(self):
        """ Валидация поля date_commencement по ограничениям стажа """

        date_commencement = self.cleaned_data.get('date_commencement')

        today = timezone.now().date()

        if date_commencement > today:
            raise ValidationError(
                'Дата начала работы не может быть больше текущей даты.')

        max_commencement_date = today - timedelta(
            days=365 * MAX_WORK_EXPERIENCE_YEARS)
        if date_commencement < max_commencement_date:
            raise ValidationError(
                f'Стаж не может быть больше {MAX_WORK_EXPERIENCE_YEARS} лет.')

        return date_commencement

    def save(self, commit=True):
        """
        Сохраняет пользователя с автоматически сгенерированным паролем.
        Пароль отправляется на email пользователя.
        """
        random_password = generate_random_password()

        user = super(EmailUserCreationForm, self).save(commit=False)

        user.set_password(random_password)

        user.is_verified = True

        try:
            user.save()

            Profile.objects.create(user=user)

            try:
                user_group = Group.objects.get(name="User")
            except Group.DoesNotExist:

                user_group = Group.objects.create(name="User")
            user.groups.add(user_group)

            custom_send_multi_format_email(
                'welcome_email',
                {'email': user.email, 'password': random_password},
                target_email=user.email
            )

        except Exception as e:
            raise Exception(
                f"Ошибка при сохранении пользователя или отправке email: {str(e)}")

        return user

    def save_m2m(self):
        """ Пустой метод для совместимости с Django. """
        pass
