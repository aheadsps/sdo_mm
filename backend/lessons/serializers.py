from rest_framework import serializers
from lessons import validators
from lessons import models
from users import serializers as user_serializers


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
    class Meta:
        model = models.ContentAttachment
        fields = (
            "id",
            "file",
            "file_type",
        )


class StepSerializer(serializers.ModelSerializer):
    content_attachment = ContentAttachmentSerializer(many=True)
    # test_block = TestBlock(many=True) добавить позже

    class Meta:
        model = models.Step
        fields = ("serial", "title", "content_text", "content_attachment")
        validators = (validators.MoreThanZeroValidator("serial"),)

    def create(self, validated_data: dict[int, str, str, dict]):
        content_attachment = validated_data.pop("content_attachment")
        print()
        step = models.Step._default_manager.create(**validated_data)
        '''content_attachment_models = [
            models.ContentAttachment(**item, content_attachment=step)
            for item in content_attachment
        ]'''
        content_attachment_models = []
        for item in content_attachment:
            content_attachment_models.append(
                models.ContentAttachment(**item, content_attachment=step)
            )



        models.ContentAttachment._default_manager.bulk_create(content_attachment_models)
        return step

    def update(self, instance, validated_data):
        """
        Обработка обновления Step
        Определаяем поля доступные для редактирования
        ContentAttachment обновляется отдельно
        """
        instance.serial = validated_data.get("serial", instance.serial)
        instance.title = validated_data.get("title", instance.title)
        instance.content_text = validated_data.get(
            "content_text", instance.content_text
        )
        instance.save()

        return instance
