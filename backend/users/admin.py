from authemail.models import EmailChangeCode, PasswordResetCode
from django.contrib import admin
from django.contrib.auth import get_user_model

from authemail.admin import (
    EmailUserAdmin,
    SignupCodeInline,
)
from users.models import (
    Profile,
    Profession,
    ProfessionGroup,
    User,
)
from users.forms import CustomUserCreationForm

# Отключение регистрации моделей в админке
admin.site.unregister(EmailChangeCode)
admin.site.unregister(PasswordResetCode)


class ProfileInline(admin.StackedInline):
    """
    Определяем встроенный класс для отображения модели Profile в админке у User
    """

    model = Profile  # Указываем модель, которую будем встраивать
    can_delete = False  # Запрещаем удаление профиля из админки пользователя
    verbose_name_plural = "Профиль инфо"  # Название для отображения в админке
    fk_name = "user"  # Указываем поле, которое связывает Profile с User


class UserAdmin(EmailUserAdmin):
    """
    Кастомная админка для модели пользователя.
    Использует форму CustomUserCreationForm для создания пользователей.
    Пароль генерируется автоматически и отправляется на почту, нужно ввести только email
    """

    add_form = CustomUserCreationForm
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "date_commencement", "profession"),
            },
        ),
    )
    # Встраиваемые модели
    inlines = (
        ProfileInline,
        SignupCodeInline,
    )
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info",
         {"fields": ("first_name", "last_name", "profession")}),
        (
            "Important dates",
            {"fields": ("date_joined", "last_login", "date_commencement")},
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_verified",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )

    readonly_fields = (
        "date_joined",
        "last_login",
    )


# Отключаем регистрацию стандартной модели пользователя
admin.site.unregister(get_user_model())
# Регистрируем кастомную админку для модели пользователя
admin.site.register(get_user_model(), UserAdmin)


def save_model(self, request, obj, form, change):
    """
    Сохранение сущности User
    При изменении у Юзера профессии он
    удаляется из группы профессий и добавляется в новую группу
    """
    if change:
        old_instance = User.objects.get(id=form.instance.id)
        # если профессия изменилась
        if old_instance.profession != form.instance.profession:
            # Удалить user в старой ProfessionGroup
            profession_group = ProfessionGroup.objects.get(
                students=old_instance.pk)
            profession_group.students.remove(form.instance)
            # Добавить user в созданную последней ProfessionGroup
            profession_group = (
                ProfessionGroup.objects.order_by("-id")
                .filter(profession=form.instance.profession_id)
                .first()
            )
            profession_group.students.add(form.instance)
            try:
                profession_group.save()
            except Exception:
                # обработка ошибки добавления юзера в группу профессий
                pass

    obj.save()
    if not change:
        """
        При создании Юзера он попадает в группу согласно профессии
        Если групп такой профессии несколько он попадает в группу
        созданную последней (с более высоким ID)
        """
        profession_group = (
            ProfessionGroup.objects.order_by("-id")
            .filter(profession=form.instance.profession_id)
            .first()
        )
        profession_group.students.add(form.instance)
        try:
            profession_group.save()
        except Exception:
            # обработка ошибки добавления юзера в группу профессий
            pass


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Регистрация модели Profile в админке."""

    list_display = ("user", "phone", "date_birthday")
    list_filter = ("date_birthday",)
    search_fields = ("user__email", "phone")
    raw_id_fields = ("user",)

    fieldsets = (
        (None, {"fields": ("user",)}),
        ("Contact Info", {"fields": ("phone",)}),
        ("Personal Info", {"fields": ("image", "date_birthday")}),
    )


@admin.register(Profession)
class ProfessionAdmin(admin.ModelAdmin):
    list_display = (
        "ru_name",
        "en_name",
    )
    search_fields = ("ru_name", "en_name")

    def save_model(self, request, obj, form, change):
        """
        Given a model instance save it to the database.
        При сохранениии данных о профессии проверяем есть ли группа профессий
        Если нет - создаем
        """
        obj.save()
        if not change:
            profession_group, create = ProfessionGroup.objects.get_or_create(
                profession=form.instance
            )
