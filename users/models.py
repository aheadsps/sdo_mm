from authemail.models import EmailAbstractUser, EmailUserManager
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.core.validators import MaxValueValidator, MinValueValidator


class Profession(models.Model):
    """ Модель Профессии """
    en_name = models.CharField(max_length=256,
                               null=True,
                               blank=True,
                               verbose_name="Название профессии"
                               )
    ru_name = models.CharField(max_length=256,
                               null=True,
                               blank=True,
                               verbose_name="Name Profession"
                               )

    class Meta:
        verbose_name = "Профессия"
        verbose_name_plural = "Профессии"

    def __str__(self):
        return self.ru_name


class User(EmailAbstractUser):
    first_name = models.CharField(max_length=30, null=True, blank=True, verbose_name="Имя пользователя")
    last_name = models.CharField(max_length=30, null=True, blank=True, verbose_name="Фамилия пользователя")
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name="Дата регистрации")
    last_login = models.DateTimeField(auto_now=True, verbose_name="Время последнего входа")
    date_commencement = models.DateField(null=False, verbose_name="Стаж работы")
    profession = models.ForeignKey(Profession, unique=False, on_delete=models.PROTECT,)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['date_commencement']

    objects = EmailUserManager()

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


class IntegerRangeField(models.IntegerField):
    """ класс поля модели IntegerField с ограничением по макс и мин заначению"""

    def __init__(self, min_value=None, max_value=None, **kwargs):
        self.validators = [MinValueValidator(min_value),
                           MaxValueValidator(max_value)]
        super().__init__(**kwargs)





class WorkExperience(models.Model):
    """ Модель стаж"""
    years = IntegerRangeField(min_value=1,
                              max_value=60,
                              default=0,
                              verbose_name="Стаж"
                              )

    class Meta:
        verbose_name = "Стаж"
        verbose_name_plural = "Стаж"

    def __str__(self):
        return self.years

