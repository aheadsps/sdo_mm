from rest_framework import serializers

from TestBlock.models import TestBlock
from lessons.serializers import AnswerSerializer, QuestionSerializer


class TestBlockSerializersOptimize(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        models = TestBlock
        fields = "__all__"


class TestBlockSerializersDetail(serializers.ModelSerializer, TestBlockSerializersOptimize):
    user_story = serializers.SerializerMethodField()
    # нужно добавить логику получения для user_story

    def get_user_story(self):
        pass

    @staticmethod
    def create(validated_data):
        """ Метод для создания новой записи в модели TestBlock. """

        questions = validated_data.pop('questions', None)
        user_story = validated_data.pop('user_story', None)

        test_block = TestBlock.objects.create(**validated_data)

        if questions is not None:
            test_block.questions = questions
        if user_story is not None:
            test_block.user_story = user_story

        test_block.save()

        return test_block

    @staticmethod
    def update(instance, validated_data):
        """ Метод для обновления существующей записи в модели TestBlock. """

        questions = validated_data.pop('questions', None)
        user_story = validated_data.pop('user_story', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if questions is not None:
            instance.questions = questions
        if user_story is not None:
            instance.user_story = user_story

        instance.save()

        return instance

    class Meta:
        model = TestBlock
        fields = '__all__'
