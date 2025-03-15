from authemail.models import EmailChangeCode, PasswordResetCode
from django.contrib import admin
from django.contrib.auth import get_user_model
from authemail.admin import EmailUserAdmin, SignupCodeInline

from users.forms import CustomUserCreationForm
from users.models import Profile

# Отключение регистрации моделей в админке
admin.site.unregister(EmailChangeCode)
admin.site.unregister(PasswordResetCode)


class ProfileInline(admin.StackedInline):
	"""
	Определяем встроенный класс для отображения модели Profile в админке у User
	"""
	model = Profile  # Указываем модель, которую будем встраивать
	can_delete = False  # Запрещаем удаление профиля из админки пользователя
	verbose_name_plural = 'Профиль инфо'  # Название для отображения в админке
	fk_name = 'user'   # Указываем поле, которое связывает Profile с User


class UserAdmin(EmailUserAdmin):
	"""
	Кастомная админка для модели пользователя.
	Использует форму CustomUserCreationForm для создания пользователей.
	Пароль генерируется автоматически и отправляется на почту, нужно ввести только email
	"""
	add_form = CustomUserCreationForm
	add_fieldsets = (
		(None, {
			'classes': ('wide',),
			'fields': ('email',  'date_commencement'),
		}),
	)
	# Встраиваемые модели
	inlines = (ProfileInline, SignupCodeInline,)
	fieldsets = (
		(None, {'fields': ('email', 'password')}),
		('Personal Info', {'fields': ('first_name', 'last_name')}),
		('Important dates', {'fields': ('date_joined', 'last_login', 'date_commencement')}),
		('Permissions', {'fields': ('is_active', 'is_staff',
									'is_superuser', 'is_verified',
									'groups', 'user_permissions')}),
	)

	readonly_fields = ('date_joined', 'last_login',)


# Отключаем регистрацию стандартной модели пользователя
admin.site.unregister(get_user_model())
# Регистрируем кастомную админку для модели пользователя
admin.site.register(get_user_model(), UserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	""" Регистрация модели Profile в админке. """
	list_display = ('user', 'phone', 'date_birthday')
	list_filter = ('date_birthday',)
	search_fields = ('user__email', 'phone')
	raw_id_fields = ('user',)

	fieldsets = (
		(None, {'fields': ('user',)}),
		('Contact Info', {'fields': ('phone',)}),
		('Personal Info', {'fields': ('image', 'date_birthday')}),
	)
