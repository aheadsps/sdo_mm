import datetime
from rest_framework import serializers
from django.utils import timezone

from loguru import logger

from lessons import models
from lessons import validators
from lessons.d_types import VD
from lessons.patrials import set_status
from users import serializers as user_serializers


PROCESS = 'process'
EXPECTED = 'expected'
DONE = 'done'
FAILED = 'failed'


class AnswerSerializer(serializers.ModelSerializer):
    """
    Сериализатор Answer
    """

    correct = serializers.BooleanField(write_only=True)

    class Meta:
        model = models.Answer
        fields = (
            "id",
            "text",
            "correct",
        )


class QuestionSerializer(serializers.ModelSerializer):
    """
    Сериализатор Question
    """

    answers = AnswerSerializer(many=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = models.Question
        fields = ("id", "text", "image", "answers")

    def create(self, validated_data: dict[str, str]):
        """
        Получение возможности создавать вопрос сразу с ответами
        """

        answers = validated_data.pop("answers")
        question = models.Question._default_manager.create(**validated_data)
        answers_models = [
            models.Answer(**answer, question=question) for answer in answers
        ]
        models.Answer._default_manager.bulk_create(answers_models)
        return question


class CreateCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор на обработку создания и обновления курсов
    """

    # ПОСЛЕ ДОБАВЛЕНИЕ LESSON ОБЯЗАТЕЛЬНО ДОБАВИТЬ И ТУТ
    class Meta:
        model = models.Course
        fields = (
            "name",
            "description",
            "beginer",
            "image",
            "profession",
            "experiences",
        )

    def create(self, validated_data):
        # Логика по созданиею курса вместе с уроком и дальнейшей целочке по порядку
        # Основа конструктора
        return super().create(validated_data)


class CourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор Оптимизарованого вывода
    """

    # ПОСЛЕ ДОБАВЛЕНИЕ LESSON ОБЯЗАТЕЛЬНО ДОБАВИТЬ И ТУТ
    class Meta:
        model = models.Course
        fields = (
            "id",
            "name",
            "description",
            "beginer",
            "create_date",
            "update_date",
            "image",
            "profession",
            "experiences",
        )


class ViewCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор вывода детального курса
    """

    experiences = user_serializers.WorkExperienceSerializer(many=True)
    profession = user_serializers.ProfessionSerializer()

    # ПОСЛЕ ДОБАВЛЕНИЕ LESSON ОБЯЗАТЕЛЬНО ДОБАВИТЬ И ТУТ
    class Meta:
        model = models.Course
        fields = (
            "id",
            "name",
            "description",
            "beginer",
            "create_date",
            "update_date",
            "image",
            "profession",
            "experiences",
        )


class EventSerializer(serializers.ModelSerializer):
    """
    Сериализатор Эвента
    """

    course = CourseSerializer()

    class Meta:
        model = models.Event
        fields = (
            "id",
            'user',
            "course",
            "done_lessons",
            "start_date",
            "end_date",
            "favorite",
            "status",
        )


class EventSerializerCreate(serializers.ModelSerializer):
    """
    Сериализатор Создания в Изменения Эвента
    """

    status = serializers.CharField(read_only=True)

    class Meta:
        model = models.Event
        fields = (
            "user",
            "course",
            "start_date",
            "end_date",
            "favorite",
            "status",
        )
        validators = (validators.TimeValidator('start_date', 'end_date'),)

    def _is_process(self, start_date: datetime.datetime) -> bool:
        """
        Определение является курс запущенным
        """
        time_now = timezone.now()
        return time_now > start_date

    def _change_status(self, validated_data: VD, process: bool) -> None:
        """
        Изменение статуса
        """
        if process:
            set_status(
                dict_data=validated_data,
                value=PROCESS,
            )
        else:
            set_status(
                dict_data=validated_data,
                value=EXPECTED,
            )

    def _correct_status(self, validated_data: VD) -> VD:
        """
        Корректировка статуса исходя от даты начала
        """
        start_date = validated_data.get('start_date')
        if start_date:
            is_process = self._is_process(start_date=start_date)
            if self.instance:
                if self.instance.status not in [DONE, FAILED]:
                    self._change_status(
                        validated_data=validated_data,
                        process=is_process,
                        )
                return
            else:
                self._change_status(
                    validated_data=validated_data,
                    process=is_process,
                )

    def save(self, **kwargs):
        logger.debug(f'before {self.validated_data}')
        self._correct_status(self.validated_data)
        logger.debug(f'after {self.validated_data}')
        return super().save(**kwargs)


class LessonCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор создания и обновления урока
    """
    # step = StepSerializer(many=True)
    # "step", "test_block добавить
    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "name",
            "serial",
            "course",
        )
        read_only_fields = ("id",)

    # def create(self, validated_data):
    #     step_items = validated_data.pop('step', [])
    #     lesson = Lesson.objects.create(**validated_data)
    #     step_create = [
    #         Step(**step, lesson=lesson) for step in step_items
    #     ]
    #     Step.objects.bulk_create(step_create)
    #     return lesson


class LessonSerializer(serializers.ModelSerializer):
    """
    Сериализатор оптимизированного вывода
    """
    # "step", "test_block добавить

    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "name",
            "serial",
            "course",
        )


class LessonViewSerializer(serializers.ModelSerializer):
    """
    Сериализатор детального представления урока
    """
    course = ViewCourseSerializer()
    # step = StepViewSerializer(many=True, read_only=True)
    # test_block = TestBlockViewSerializer(read_only=True)

    # "step", "test_block добавить
    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "name",
            "serial",
            "course",
        )
