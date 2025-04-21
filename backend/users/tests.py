import datetime

from rest_framework.test import APITestCase

from users.models import Profession, ProfessionGroup, User


class TestEmailUserManagerAddProf(APITestCase):
    def test_create_superuser_is_incorrect(self):
        """Создаем первого superuser"""
        User.objects.create_superuser(
            email="email@emial.ru",
            password="superuser",
            date_commencement=datetime.date(2020, 10, 10),
        )
        user = User.objects.get(email="email@emial.ru")
        # Проверка создание записи юзер """
        self.assertEqual(user.email, "email@emial.ru")
        profession = Profession.objects.get(id=user.profession_id)
        # Проверка создания профессии """
        self.assertEqual(profession.en_name, "admin")
        profession_group = ProfessionGroup.objects.get(profession_id=profession.id)
        users = profession_group.students.all()
        # Проверка создания группы профессий и попадания в эту группу """
        self.assertEqual(users[0].email, "email@emial.ru")

        """ Создаем второго superuser """
        User.objects.create_superuser(
            email="email2@emial.ru",
            password="superuser",
            date_commencement=datetime.date(2020, 10, 10),
        )
        user = User.objects.get(email="email2@emial.ru")
        # Проверка создание записи юзер """
        self.assertEqual(user.email, "email2@emial.ru")
        profession = Profession.objects.get(id=user.profession_id)
        # Проверка создания профессии """
        self.assertEqual(profession.en_name, "admin")
        profession_group = ProfessionGroup.objects.get(profession_id=profession.id)
        users = profession_group.students.all()
        # Проверка создания группы профессий и попадания в эту группу """
        self.assertEqual(users[0].email, "email@emial.ru")
        self.assertEqual(users[1].email, "email2@emial.ru")
