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
            logger.debug(f'scope: {self.scope}')
            logger.debug(f'user is {self.user}')
            if not self.user or not self.user.is_authenticated:
                self._close_with_error(
                    "Требуется авторизация", 401)
                return

            self.block_id = self.scope['url_route']['kwargs']['block_id']
            logger.debug(f'get block_id {self.block_id}')

            try:
                self.test_block = TestBlock.objects.select_related(
                    'lesson__course').get(pk=self.block_id)
                logger.debug(f'get test_block {self.test_block}')

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
        data = json.loads(text_data)
        answer_id = data.get('answer_id')
        block_id = data.get('block_id')

        if not answer_id or not block_id:
            return self._send_invalid_answer()

        if str(block_id) != str(self.block_id):
            return self._send_invalid_answer(answer_id)

        if UserStory._default_manager.filter(
            user=self.user,
            answer_id=answer_id,
        ).exists():
            self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Ответ уже был дан'
            }))
            return

        answer = Answer.objects.get(
            pk=answer_id,
            question__test_block=self.test_block
        )

        self._process_user_answer(answer)
        self._send_answer_result(answer)

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
        self.total_answers = Answer.objects.filter(
            correct=True,
            question__test_block=self.test_block,
        ).count()
        logger.debug(f'total correct answers expect {self.total_answers}')

        self.correct_answers = UserStory.objects.filter(
            user=self.user,
            test_block=self.test_block,
            answer__correct=True
        ).count()
        logger.debug(f'total correct answers {self.correct_answers}')

        self.done = ((self.correct_answers / self.total_answers) >= 0.8
                     ) if self.total_answers > 0 else False
        logger.debug(f'test block is done {self.done}')

        current_lesson = self.test_block.lesson
        logger.debug(f'current lesson is {current_lesson}')
        self.next_lesson = Lesson.objects.filter(
            course=current_lesson.course,
            serial=current_lesson.serial + 1
        ).first()
        logger.debug(f'next_lesson is {self.next_lesson}')

        self.next_opened = True
        if self.next_lesson:
            self.next_lesson_id = self.next_lesson.pk
            self.next_opened = LessonStory.objects.filter(
                user=self.user,
                lesson=self.next_lesson
            ).exists()
            logger.debug(f'next_opened {self.next_opened}')
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
            logger.debug(f'answer is correct and correct answers summary is {self.correct_answers}')
            self._check_progress()
        logger.debug(f'correct answers after process is {self.correct_answers}')

    def _check_progress(self):
        """
        Проверка достижения 80% правильных ответов
        """
        current_progress = self.correct_answers / self.total_answers
        logger.debug(f'current_progress {current_progress}')
        was_done = self.done
        self.done = current_progress >= 0.8
        logger.debug(f'done is now {self.done}')

        if (self.done and not was_done and not self.next_opened and
                self.next_lesson_id):
            LessonStory.objects.create(
                user=self.user,
                lesson_id=self.next_lesson_id,
                course=self.test_block.lesson.course
            )
            self.next_opened = True
            logger.debug('next lesson is opened now')

            self._check_course_completion()

    def _check_course_completion(self):
        """
        Проверка завершения всех уроков курса и 80% правильных ответов
        по всему курсу, если да то обновляет статус Event в done
        """
        course = self.test_block.lesson.course
        logger.debug(f'Проверка курса {course.name}')

        if course is None:
            logger.debug('Курс не найден')
            return

        total_lessons = Lesson.objects.filter(course=course).count()
        logger.debug(f'Всего уроков {total_lessons}')
        opened_lessons = LessonStory.objects.filter(
            user=self.user,
            course=course
        ).count()
        logger.debug(f'Доступно уроков: {opened_lessons}')

        total_correct_answers = UserStory.objects.filter(
            user=self.user,
            answer__correct=True,
            test_block__lesson__course=course
        ).count()
        logger.debug(f'Кол-во правильных ответов пользователя'
                     f' {total_correct_answers}')

        total_possible_answers = Answer.objects.filter(
            correct=True,
            question__test_block__lesson__course=course
        ).count()
        logger.debug(f'Кол-во правильных ответов ВСЕГО:'
                     f' {total_correct_answers}')

        course_progress = total_correct_answers / total_possible_answers\
            if total_possible_answers > 0 else 0
        logger.debug(f'прогресс по курсу составил'
                     f' {int(course_progress * 100)}%')

        if opened_lessons == total_lessons and course_progress >= 0.8:
            event = Event.objects.get(user=self.user, course=course)
            event.status = 'done'
            event.done_lessons = total_lessons
            event.save()
            logger.debug(
                f'Курс {course.name} имеет {int(course_progress * 100)}%'
                f' правильных ответов, статус курса перешел в  {event.status}')

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
