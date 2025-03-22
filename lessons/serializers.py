from rest_framework import serializers

from lessons import models
from lessons.models import TestBlock
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


class TestBlockSerializersOptimize(serializers.ModelSerializer):
    """
    Сериалайзер оптимизированный
    """
    questions = QuestionSerializer(many=True, read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        models = TestBlock
        fields = "__all__"


class TestBlockSerializersDetail(
    serializers.ModelSerializer
):
    """
    Сериалайзер детальный с логикой получения user_story, создания и обновления существующих записей.
    """
    questions = QuestionSerializer(many=True, read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    user_story = serializers.SerializerMethodField()

    class Meta:
        model = TestBlock
        fields = "__all__"

    # нужно добавить логику получения для user_story
    def get_user_story(self):
        pass

    def create(self, validated_data):
        """
        Метод для создания новой записи в модели TestBlock.
        """

        questions = validated_data.pop("questions", None)
        answers = validated_data.pop("answers", None)
        user_story = validated_data.pop("user_story", None)

        test_block = TestBlock.objects.create(**validated_data)

        if questions is not None:
            test_block.questions = questions
            test_block.answers = answers

        if user_story is not None:
            test_block.user_story = user_story

        test_block.save()

        return test_block

    def update(self, instance, validated_data):
        """
        Метод для обновления существующей записи в модели TestBlock.
        """

        questions = validated_data.pop("questions", None)
        answers = validated_data.pop("answers", None)
        user_story = validated_data.pop("user_story", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if questions is not None:
            instance.questions = questions
            instance.answers = answers

        if user_story is not None:
            instance.user_story = user_story

        instance.save()

        return instance