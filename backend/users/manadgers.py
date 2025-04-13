import math
from datetime import date

from django.utils import timezone
from django.db.models import Q

from authemail.models import EmailUserManager


class EmailUserManagerAddProf(EmailUserManager):
    """
    Менеджер для корректной работый специфицеских частей программы
    """

    def _set_events(self, user):
        """
        Нахождение всех эвентов которые являются начальными
        и подходят для данного пользователя
        """
        profession = user.profession
        time_now = timezone.now()
        date_now = date(year=time_now.year, month=time_now.month, day=time_now.date)
        experience_years = math.floor((date_now - user.date_commencement).days / 365)
        experience = WorkExperience._default_manager.get_or_create(years=experience_years)
        courses = Course._default_manager.filter(Q(profession=profession) &
                                                 Q(experiences=experience) &
                                                 Q(beginner=True))
        qfilter = Q(*[Q(course=course) for course in courses], _connector=Q.OR)
        events = Event._default_manager.filter(qfilter).get_queryset()
        if events:
            EventCovered._default_manager.bulk_create(
                [EventCovered(user=user,
                              event=event,
                              status='process',
                              )
                 for event
                 in events]
            )
        return user

    def _create_user(
        self,
        email: str,
        password: str,
        is_staff: bool,
        is_superuser: bool,
        is_verified: bool,
        **extra_fields
    ):
        """
        Кастомное добавление профессии
        При команде createsuperuser создание профессии 'admin'
        если ее нет, а иначе пропустить,
        а затем группу под эту профессию.
        Учетная запись должна получить новосозданную профессию
        и попасть в группу по этой профессии.
        """

        from users.models import Profession, ProfessionGroup, User, WorkExperience
        from lessons.models import EventCovered, Course, Event

        now = timezone.now()
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)

        try:
            profession = Profession.objects.get(en_name="admin")
        except Profession.DoesNotExist:
            # если не создаем группу админ и профессию админ
            profession = Profession.objects.create(
                en_name="admin",
                ru_name="admin",
            )
            profession_group = ProfessionGroup.objects.create(
                profession=profession,
            )
        else:
            # Ищем группу для этой профессии
            profession_group = (
                ProfessionGroup.objects.order_by("-id")
                .filter(profession=profession.pk)
                .first()
            )

        # Юзеру назначаем профессию
        user = self.model(
            email=email,
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            is_verified=is_verified,
            last_login=now,
            date_joined=now,
            profession=profession,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        user_new = User.objects.get(email=email)

        # Это после сохранения юзера
        profession_group.students.add(user_new)
        profession_group.save()
        self._set_events(user=user)
        return user
