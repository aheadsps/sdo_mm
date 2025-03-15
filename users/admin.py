from django.contrib import admin
from django.contrib.auth import get_user_model
from authemail.admin import EmailUserAdmin, SignupCodeInline, EmailChangeCodeInline, PasswordResetCodeInline
from users.forms import CastomEmailUserChangeForm
from users.models import Profile, Profession


class ProfileInline(admin.StackedInline):
	model = Profile
	can_delete = False
	verbose_name_plural = 'Profile'
	fk_name = 'user'


class UserAdmin(EmailUserAdmin):
	inlines = ( ProfileInline, SignupCodeInline, EmailChangeCodeInline, PasswordResetCodeInline,)
	fieldsets = (
		(None, {'fields': ('email', 'password', 'date_commencement', 'profession')}),
		('Personal Info', {'fields': ('first_name', 'last_name')}),
		('Permissions', {'fields': ('is_active', 'is_staff',
									'is_superuser', 'is_verified',
									'groups', 'user_permissions')}),
		('Important dates', {'fields': ('date_joined', 'last_login')}),
	)
	add_fieldsets = (
		(None, {
			'classes': ('wide',),
			'fields': ('email', 'password1', 'password2',  'date_commencement', 'profession'),
		}),
	)
	readonly_fields = ('date_joined', 'last_login')
	form = CastomEmailUserChangeForm


admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), UserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	list_display = ('user',  'phone', 'date_birthday')
	list_filter = ('date_birthday',)
	search_fields = ('user__email', 'phone')
	raw_id_fields = ('user',)

	fieldsets = (
		(None, {'fields': ('user',)}),
		('Contact Info', {'fields': ('phone',)}),
		('Personal Info', {'fields': ('image', 'date_birthday')}),
	)

@admin.register(Profession)
class ProfessionAdmin(admin.ModelAdmin):
	list_display = ('en_name', 'ru_name')
	search_fields = ('en_name', 'ru_name')
