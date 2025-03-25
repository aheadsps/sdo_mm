from rest_framework import serializers
from lessons import validators
from lessons import models
from users import serializers as user_serializers
from rest_framework.utils import html, model_meta
from config.settings import MEDIA_ROOT
import os


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


class CourseSerializer(serializers.ModelSerializer):
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


class ViewCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор вывода курса
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
    Сериализатор Курса
    """

    course = CourseSerializer()

    class Meta:
        model = models.Event
        fields = (
            "id",
            "course",
            "done_lessons",
            "start_date",
            "end_date",
            "favorite",
            "status",
        )


class AnswerSerializer(serializers.ModelSerializer):
    """
    Сериализатор Answer
    """

    class Meta:
        model = models.Answer
        fields = (
            "id",
            "text",
            "correct",
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
