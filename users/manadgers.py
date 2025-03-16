from django.contrib.auth.models import UserManager
from django.apps import apps
from django.contrib.auth.hashers import make_password
from authemail.models import EmailUserManager
from django.contrib.auth.base_user import BaseUserManager
from django.utils import timezone


class EmailUserManagerAddProf(EmailUserManager, BaseUserManager):
    def _create_user(self, email, password, is_staff, is_superuser,
                     is_verified, **extra_fields):
        """
        Creates and saves a User with a given email and password.
        """
        from users.models import Profession, ProfessionGroup, User
        now = timezone.now()
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        """Кастомное добавление профессии
        При команде createsuperuser создание профессии 'admin' 
        если ее нет, а иначе пропустить, 
        а затем группу под эту профессию. 
        Учетная запись должна получить новосозданную профессию 
        и попасть в группу по этой профессии."""
        # ищем профессию admin
        profession_id = None
        try:
            profession = Profession.objects.get(en_name='admin')
        except Profession.DoesNotExist:
            # если не создаем группу админ и профессию админ
            profession = Profession.objects.create(en_name='admin', ru_name='admin')
            profession_group = ProfessionGroup.objects.create(profession=profession)
        else:
            # Ищем группу для этой профессии
            profession_group = ProfessionGroup.objects.order_by('-id').filter(
                profession=profession.pk
            ).first()
            # Юзеру назначаем профессию


        user = self.model(email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser, is_verified=is_verified,
                          last_login=now, date_joined=now,
                          profession=profession,
                          **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        user_new = User.objects.get(email=email)

        # Это после сохранения юзера
        profession_group.students.add(user_new)
        profession_group.save()

        return user