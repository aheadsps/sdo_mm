from rest_framework import serializers

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
