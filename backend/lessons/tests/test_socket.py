# import datetime
# import json

# from channels.db import database_sync_to_async
# from rest_framework.test import APITestCase
# from django.contrib.auth import get_user_model
# from channels.testing import WebsocketCommunicator

# from lessons.consumers import AnswerCheckerConsumer
# from lessons import models as lessons_models
# from users import models as users_models


# class TestSocket(APITestCase):
#     """
#     Тесты сокета
#     """

#     def setUp(self):
#         self.profession = users_models.Profession._default_manager.create(
#             en_name="prof",
#             ru_name="проф",
#         )
#         self.experience = users_models.WorkExperience._default_manager.create(
#             years=0,
#         )
#         date_commencement = datetime.date(
#             year=2023,
#             month=1,
#             day=1,
#         )
#         self.user = get_user_model()._default_manager.create(
#             email="user@gmail.com",
#             profession=self.profession,
#             password="password",
#             date_commencement=date_commencement,
#             is_staff=True,
#         )
#         self.user_1 = get_user_model()._default_manager.create(
#             email="user1@gmail.com",
#             profession=self.profession,
#             password="password",
#             date_commencement=date_commencement,
#         )
#         group_profession = users_models.ProfessionGroup._default_manager.create(
#             profession=self.profession,
#         )
#         group_profession.students.add(self.user)
#         group_profession.save()
#         course = lessons_models.Course._default_manager.create(
#             teacher=self.user,
#             name="course bobr",
#             description="some",
#             interval=datetime.timedelta(days=7),
#             profession=self.profession,
#         )
#         course.experiences.add(
#             self.experience,
#         )
#         course.save()
#         lesson = lessons_models.Lesson._default_manager.create(
#             teacher=self.user,
#             name="lesson", course=course
#         )
#         lesson_1 = lessons_models.Lesson._default_manager.create(
#             teacher=self.user,
#             name="lesson_1", course=course, serial=2,
#         )
#         lessons_models.LessonStory._default_manager.create(
#             course=course,
#             lesson=lesson,
#             user=self.user,
#         )
#         lessons_models.Step._default_manager.create(
#             title="step",
#             lesson=lesson,
#         )
#         self.test_block = lessons_models.TestBlock._default_manager.create(
#             lesson=lesson
#         )
#         question = lessons_models.Question._default_manager.create(
#             text="text",
#             test_block=self.test_block,
#         )
#         question_1 = lessons_models.Question._default_manager.create(
#             text="text_1",
#             test_block=self.test_block,
#         )
#         self.answer_1 = lessons_models.Answer._default_manager.create(
#             text="answer_1",
#             correct=False,
#             question=question,
#         )
#         self.answer_2 = lessons_models.Answer._default_manager.create(
#             text="answer_2",
#             correct=True,
#             question=question,
#         )
#         self.answer_3 = lessons_models.Answer._default_manager.create(
#             text="answer_3",
#             correct=False,
#             question=question,
#         )
#         self.answer_4 = lessons_models.Answer._default_manager.create(
#             text="answer_4",
#             correct=True,
#             question=question_1,
#         )
#         self.answer_5 = lessons_models.Answer._default_manager.create(
#             text="answer_5",
#             correct=True,
#             question=question_1,
#         )
#         self.answer_6 = lessons_models.Answer._default_manager.create(
#             text="answer_6",
#             correct=False,
#             question=question_1,
#         )
#         self.answer_7 = lessons_models.Answer._default_manager.create(
#             text="answer_7",
#             correct=True,
#             question=question_1,
#         )
#         self.answer_8 = lessons_models.Answer._default_manager.create(
#             text="answer_8",
#             correct=True,
#             question=question,
#         )
#         lessons_models.Event._default_manager.create(
#             user=self.user,
#             course=course,
#             start_date=datetime.datetime(year=2026, month=1, day=1),
#             end_date=None,
#         )
#         self.client.force_authenticate(self.user)
#         self.web_url = f"test-block/{self.test_block.pk}"

#     async def test_consumer(self):
#         communicator = WebsocketCommunicator(
#             application=AnswerCheckerConsumer.as_asgi(),
#             path=self.web_url,
#         )
#         communicator.scope.update(
#             user=self.user,
#             url_route=dict(kwargs=dict(block_id=self.test_block.pk)),
#         )
#         connected, subprotocol = await communicator.connect()
#         self.assertTrue(connected)

#         data = dict(answer_id=self.answer_2.pk, block_id=self.test_block.pk)
#         await communicator.send_json_to(data=data)
#         response = await communicator.receive_from()
#         self.assertEqual(
#             json.loads(response),
#             dict(
#                 answer_id=self.answer_2.pk,
#                 correct=self.answer_2.correct,
#             ),
#         )

#         data = dict(answer_id=self.answer_2.pk, block_id=self.test_block.pk)
#         await communicator.send_json_to(data=data)
#         response = await communicator.receive_from()
#         self.assertEqual(
#             json.loads(response),
#             {'message': 'Ответ уже был дан', 'type': 'error'},
#         )

#         data = dict(answer_id=self.answer_1.pk, block_id=self.test_block.pk)
#         await communicator.send_json_to(data=data)
#         response = await communicator.receive_from()
#         self.assertEqual(
#             json.loads(response),
#             {'correct': False, 'answer_id': self.answer_1.pk},
#         )

#         data = dict(answer_id=self.answer_5.pk, block_id=self.test_block.pk)
#         await communicator.send_json_to(data=data)
#         response = await communicator.receive_from()
#         self.assertEqual(
#             json.loads(response),
#             {'correct': True, 'answer_id': self.answer_5.pk},
#         )

#         data = dict(answer_id=self.answer_4.pk, block_id=self.test_block.pk)
#         await communicator.send_json_to(data=data)
#         response = await communicator.receive_from()
#         self.assertEqual(
#             json.loads(response),
#             {'correct': True, 'answer_id': self.answer_4.pk},
#         )

#         data = dict(answer_id=self.answer_6.pk, block_id=self.test_block.pk)
#         await communicator.send_json_to(data=data)
#         response = await communicator.receive_from()
#         self.assertEqual(
#             json.loads(response),
#             {'correct': False, 'answer_id': self.answer_6.pk},
#         )

#         data = dict(answer_id=self.answer_7.pk, block_id=self.test_block.pk)
#         await communicator.send_json_to(data=data)
#         response = await communicator.receive_from()
#         self.assertEqual(
#             json.loads(response),
#             {'correct': True, 'answer_id': self.answer_7.pk},
#         )
#         await communicator.disconnect()
