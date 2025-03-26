import datetime
from rest_framework import serializers
from django.utils import timezone

from loguru import logger

from lessons import models
from lessons import validators
from lessons.d_types import VD
from lessons.patrials import set_status
from users import serializers as user_serializers
from rest_framework.utils import html, model_meta
from config.settings import MEDIA_ROOT
import os


PROCESS = "process"
EXPECTED = "expected"
DONE = "done"
FAILED = "failed"


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


class TestBlockSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = models.TestBlock
        fields = ('id', 'questions')


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
            "user",
            "course",
            "done_lessons",
            "start_date",
            "end_date",
            "favorite",
            "status",
        )


class ContentAttachmentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = models.ContentAttachment
        fields = ["id", "file", "file_type"]


class StepSerializer(serializers.ModelSerializer):
    content_attachment = ContentAttachmentSerializer(many=True)
    # test_block = TestBlock(many=True) добавить позже

    class Meta:
        model = models.Step
        fields = ("serial", "title", "content_text", "content_attachment")
        validators = (validators.MoreThanZeroValidator("serial"),)

    def create(self, validated_data: dict[int, str, str, dict]):
        """
        Создаем новый шаг урока
        """
        content_attachment = validated_data.pop("content_attachment")
        step = models.Step._default_manager.create(**validated_data)
        # Заполняем поле content_attachment
        content_attachment_models = []
        for item in content_attachment:
            content_attachment_models.append(
                models.ContentAttachment(**item, content_attachment=step)
            )
        models.ContentAttachment._default_manager.bulk_create(content_attachment_models)
        return step

    def update(self, instance, validated_data):
        """
        Обработка обновления Step.

        ContentAttachment не редактируется:
        создается новый или удаляется
        В API-запросе необходимо передать
        ВСЕ актуальные записи ContentAttachment вместе с их ID
        Если запись передана не будет - она удаляется из БД.
        Если ID = null или не указан создается новая запись
        """

        # Определяем поля Step
        instance.serial = validated_data.get("serial", instance.serial)
        instance.title = validated_data.get("title", instance.title)
        instance.content_text = validated_data.get(
            "content_text", instance.content_text
        )

        # Получаем ID удаленных content_attachment
        id_attachment_new = [
            item.get("id")
            for item in validated_data.get("content_attachment")
            if not item.get("id") is None
        ]
        id_attachment_old = [item.id for item in instance.content_attachment.all()]
        id_attachment_delete = set(id_attachment_old) - set(id_attachment_new)
        # Удалить старые content_attachment
        delete_list = models.ContentAttachment.objects.filter(
            id__in=list(id_attachment_delete)
        )
        for item in delete_list:
            if item.file.name:
                file_path = item.file.name.split("/")
                file_path = os.path.join(MEDIA_ROOT, *file_path)
                try:
                    os.remove(file_path)
                except Exception:
                    # запись в логи...
                    pass
        delete_list.delete()

        # Заполняем новые поля content_attachment
        content_attachment_models = []
        for item in validated_data.get("content_attachment"):
            if not item.get("id", None):
                content_attachment_models.append(
                    models.ContentAttachment(**item, content_attachment=instance)
                )
        models.ContentAttachment._default_manager.bulk_create(content_attachment_models)

        instance.save()

        return instance


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
        validators = (validators.TimeValidator("start_date", "end_date"),)

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
        start_date = validated_data.get("start_date")
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
        logger.debug(f"before {self.validated_data}")
        self._correct_status(self.validated_data)
        logger.debug(f"after {self.validated_data}")
        return super().save(**kwargs)
