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


class ContentAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContentAttachment
        fields = ('file', 'file_type',)


class StepSerializer(serializers.ModelSerializer):
    content_attachment = ContentAttachmentSerializer(many=True)
    #test_block = TestBlock(many=True)

    class Meta:
        model = models.Step
        fields = ('serial','title','content_text', 'content_attachment')

    def create(self, validated_data: dict[int, str, str, dict]):
        content_attachment = validated_data.pop('content_attachment')
        step = models.Step._default_manager.create(**validated_data)
        content_attachment_models = [models.ContentAttachment
                                        (
                                        **item_content_attachment,
                                        content_attachment=step
                                        )
                                        for item_content_attachment
                                        in content_attachment
                                    ]
        models.ContentAttachment._default_manager.bulk_create(
                                            content_attachment_models
                                        )
        return step


