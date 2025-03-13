from authemail.models import EmailAbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class User(EmailAbstractUser):
    first_name = models.CharField(max_length=30, null=True, blank=True, verbose_name="Имя пользователя")
    last_name = models.CharField(max_length=30, null=True, blank=True, verbose_name="Фамилия пользователя")
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name="Дата регистрации")
    last_login = models.DateTimeField(auto_now=True, verbose_name="Время последнего входа")
    date_commencement = models.DateField(null=False, verbose_name="Стаж работы")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['date_commencement']

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return self.email


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = PhoneNumberField(max_length=20, null=True, blank=True, verbose_name="Телефон")
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True, verbose_name="Аватар")
    date_birthday = models.DateField(null=True, blank=True, verbose_name="Дата рождения")

    class Meta:
        verbose_name = "Пользователь инфо"
        verbose_name_plural = "Пользователи инфо"

    def __str__(self):
        return f"Profile of {self.user.email}"
