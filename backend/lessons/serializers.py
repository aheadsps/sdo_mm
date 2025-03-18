from rest_framework import serializers

from lessons import models


class AnswerSerializer(serializers.ModelSerializer):
    """
    Сериализатор Answer
    """

    class Meta:
        model = models.Answer
        fields = ('id', 'text', 'correct',)


class QuestionSerializer(serializers.ModelSerializer):
    """
    Сериализатор Question
    """

    answers = AnswerSerializer(many=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = models.Question
        fields = ('id', 'text', 'image', 'answers')

    def create(self, validated_data: dict[str, str]):
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
