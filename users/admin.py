from django.contrib import admin
from django.contrib.auth import get_user_model
from authemail.admin import (EmailUserAdmin,
                             SignupCodeInline,
                             EmailChangeCodeInline,
                             PasswordResetCodeInline,
                             )
from users.models import (Profile,
                          Profession,
                          ProfessionGroup,
                          User,
                          )


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


class UserAdmin(EmailUserAdmin):
    inlines = (ProfileInline,
               SignupCodeInline,
               EmailChangeCodeInline,
               PasswordResetCodeInline,
               )
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
            'fields': ('email', 'password1', 'password2', 'date_commencement', 'profession'),
        }),
    )
    readonly_fields = ('date_joined', 'last_login')

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
                    students=old_instance.pk
                )
                profession_group.students.remove(form.instance)
                # Добавить user в созданную последней ProfessionGroup
                profession_group = ProfessionGroup.objects.order_by('-id').filter(
                    profession=form.instance.profession_id
                ).first()
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
            print("***********",form.instance.profession_id)
            profession_group = ProfessionGroup.objects.order_by('-id').filter(
                profession=form.instance.profession_id).first()
            profession_group.students.add(form.instance)
            try:
                profession_group.save()
            except Exception:
                # обработка ошибки добавления юзера в группу профессий
				pass


admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), UserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'date_birthday')
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
    list_display = ('ru_name', 'en_name',)
    search_fields = ('ru_name', 'en_name')

    def save_model(self, request, obj, form, change):
        """
        Given a model instance save it to the database.
        При сохранениии данных о профессии проверяем есть ли группа профессий
        Если нет - создаем
        """
        obj.save()
        if not change:
            profession_group, create = ProfessionGroup.objects.get_or_create(profession=form.instance)
