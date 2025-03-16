from rest_framework import serializers

from lessons import models


class AnswerSerializer(serializers.ModelSerializer):
    """
    Сериализатор Answer
    """

    class Meta:
        model = models.Question
        fields = ('id', 'text', 'correct',)


class QuestionSerializer(serializers.ModelSerializer):
    """
    Сериализатор Question
    """

    answers = serializers.RelatedField(many=True)

    class Meta:
        model = models.Question
        fields = ('id', 'text', 'image', 'answers')

    def create(self, validated_data):
        """
        Получение возможности создавать вопрос сразу с ответами
        """

        answers = validated_data.pop('answers')
        question = models.Question._default_manager.create(**validated_data)
        answers_models = [models.Answer(**answer, question=question)
                          for answer
                          in answers]
        models.Answer._default_manager.bulk_create(answers_models)
        return question
