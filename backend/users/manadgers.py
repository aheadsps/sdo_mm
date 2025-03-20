from authemail.models import EmailUserManager
from django.utils import timezone


class EmailUserManagerAddProf(EmailUserManager):
    """
    Менеджер для корректной работый специфицеских частей программы
    """

    def _create_user(self, email: str,
                     password: str,
                     is_staff: bool,
                     is_superuser: bool,
                     is_verified: bool,
                     **extra_fields):
        """
        Кастомное добавление профессии
        При команде createsuperuser создание профессии 'admin'
        если ее нет, а иначе пропустить,
        а затем группу под эту профессию.
        Учетная запись должна получить новосозданную профессию
        и попасть в группу по этой профессии.
        """

        from users.models import Profession, ProfessionGroup, User

        now = timezone.now()
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)

        try:
            profession = Profession.objects.get(en_name='admin')
        except Profession.DoesNotExist:
            # если не создаем группу админ и профессию админ
            profession = Profession.objects.create(
                en_name='admin',
                ru_name='admin',
                )
            profession_group = ProfessionGroup.objects.create(
                profession=profession,
                )
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
