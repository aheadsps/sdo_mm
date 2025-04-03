import datetime

from django.test import TestCase
from django.contrib.auth import get_user_model
from channels.testing import WebsocketCommunicator

from lessons.consumers import AnswerCheckerConsumer
from lessons import models as lessons_models
from users import models as users_models


class TestSocket(TestCase):
    """
    Тесты сокета
    """
    def setUp(self):
        self.profession = users_models.Profession._default_manager.create(
            en_name="prof",
            ru_name="проф",
        )
        self.experience = users_models.WorkExperience._default_manager.create(
            years=0,
        )
        date_commencement = datetime.date(
            year=2023,
            month=1,
            day=1,
        )
        self.user = get_user_model()._default_manager.create(
            email="user@gmail.com",
            profession=self.profession,
            password="password",
            date_commencement=date_commencement,
            is_staff=True,
        )
        self.user_1 = get_user_model()._default_manager.create(
            email="user1@gmail.com",
            profession=self.profession,
            password="password",
            date_commencement=date_commencement,
        )
        group_profession = users_models.ProfessionGroup._default_manager.create(
            profession=self.profession,
        )
        group_profession.students.add(self.user)
        group_profession.save()
        self.course = lessons_models.Course._default_manager.create(
            name="course",
            description="some",
            profession=self.profession,
        )
        self.course.experiences.add(
            self.experience,
        )
        self.course.save()
        self.event = lessons_models.Event._default_manager.create(
            user=self.user,
            course=self.course,
            start_date=datetime.datetime(year=2026, month=1, day=1),
            end_date=None,
        )
        self.client.force_authenticate(self.user)

    async def test_consumer(self):
        self.communicator = WebsocketCommunicator(AnswerCheckerConsumer.as_asgi())
