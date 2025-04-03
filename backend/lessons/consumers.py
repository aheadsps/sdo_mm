from channels.generic.websocket import WebsocketConsumer
import json
from django.core.exceptions import ObjectDoesNotExist
from loguru import logger
from .models import TestBlock, Question, UserStory, Lesson, LessonStory, \
    Answer, Event


class AnswerCheckerConsumer(WebsocketConsumer):
    def connect(self):
        """Инициализация соединения с проверкой доступа"""
        try:
            self.user = self.scope.get("user")
            if not self.user or not self.user.is_authenticated:
                self._close_with_error(
                    "Требуется авторизация", 401)
                return

            self.block_id = self.scope['url_route']['kwargs']['block_id']

            try:
                self.test_block = TestBlock.objects.select_related(
                    'lesson__course').get(pk=self.block_id)

                if not Event.objects.filter(
                        user=self.user,
                        course_id=self.test_block.lesson.course_id).exists():
                    self._close_with_error(
                        "Доступ к тестовому блоку запрещен", 403
                    )
                    return

                self._initialize_block_data()
                self.accept()

            except ObjectDoesNotExist:
                self._close_with_error(
                    "Тестовый блок не найден", 404)
            except Exception as e:
                logger.error(f"Ошибка подключения: {str(e)}")
                self._close_with_error(
                    "Внутренняя ошибка сервера", 500
                )

        except Exception as e:
            logger.error(f"Ошибка в connect: {str(e)}")
            self._close_with_error("Ошибка сервера", 500)

    def receive(self, text_data):
        """
        Обработка ответов пользователя
        """
        try:
            data = json.loads(text_data)
            answer_id = data.get('answer_id')
            block_id = data.get('block_id')

            if not answer_id or not block_id:
                return self._send_invalid_answer()

            if str(block_id) != str(self.block_id):
                return self._send_invalid_answer(answer_id)

            answer = Answer.objects.get(
                pk=answer_id,
                question__test_block=self.test_block
            )

            self._process_user_answer(answer)
            self._send_answer_result(answer)

        except ObjectDoesNotExist:
            self._send_invalid_answer()
        except Exception as e:
            logger.error(f"Ошибка обработки: {str(e)}")
            self._send_invalid_answer()

    def disconnect(self, close_code):
        """
        Отключение пользователя
        """
        logger.info(
            f"Пользователь {self.user.id} отключился от блока {self.block_id}."
            f"Код: {close_code}"
        )
        self.close(close_code)

    def _initialize_block_data(self):
        """
        Инициализация данных о тестовом блоке
        """
        self.total_questions = Question.objects.filter(
            test_block=self.test_block
        ).count()

        self.correct_answers = UserStory.objects.filter(
            user=self.user,
            test_block=self.test_block,
            answer__correct=True
        ).count()

        self.done = (self.correct_answers / self.total_questions >= 0.8
                     ) if self.total_questions > 0 else False

        current_lesson = self.test_block.lesson
        self.next_lesson = Lesson.objects.filter(
            course=current_lesson.course,
            serial=current_lesson.serial + 1
        ).first()

        self.next_opened = True
        if self.next_lesson:
            self.next_lesson_id = self.next_lesson.pk
            self.next_opened = LessonStory.objects.filter(
                user=self.user,
                lesson=self.next_lesson
            ).exists()
        else:
            self.next_lesson_id = None

    def _process_user_answer(self, answer):
        """
        Обработка ответа пользователя
        """
        UserStory.objects.create(
            user=self.user,
            answer=answer,
            test_block=self.test_block
        )

        if answer.correct:
            self.correct_answers += 1
            self._check_progress()

    def _check_progress(self):
        """
        Проверка достижения 80% правильных ответов
        """
        current_progress = self.correct_answers / self.total_questions
        was_done = self.done
        self.done = current_progress >= 0.8

        if (self.done and not was_done and not self.next_opened and
                self.next_lesson_id):
            LessonStory.objects.create(
                user=self.user,
                lesson_id=self.next_lesson_id,
                course=self.test_block.lesson.course
            )
            self.next_opened = True

    def _send_answer_result(self, answer):
        """
        Отправка результата проверки ответа
        """
        self.send(text_data=json.dumps({
            'answer_id': answer.id,
            'answer': answer.correct
        }))

    def _send_invalid_answer(self, answer_id=None):
        """
        Отправка невалидного ответа
        """
        self.send(text_data=json.dumps({
            'answer_id': int(answer_id) if answer_id else -1,
            'answer': False
        }))

    def _close_with_error(self, message, code):
        """
        Закрытие соединения с ошибкой
        """
        self.send(text_data=json.dumps({
            'type': 'error',
            'message': message
        }))
        self.close(code=code)
