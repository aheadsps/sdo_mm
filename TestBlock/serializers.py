from rest_framework import serializers

from lessons.serializers import AnswerSerializer, QuestionSerializer
from TestBlock.models import TestBlock


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
    serializers.ModelSerializer, TestBlockSerializersOptimize
):
    """
    Сериалайзер детальный с логикой получения user_story, создания и обновления существующих записей.
    """
    user_story = serializers.SerializerMethodField()

    class Meta:
        model = TestBlock
        fields = "__all__"

    # нужно добавить логику получения для user_story
    def get_user_story(self):
        pass

    @staticmethod
    def create(validated_data):
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

    @staticmethod
    def update(instance, validated_data):
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
