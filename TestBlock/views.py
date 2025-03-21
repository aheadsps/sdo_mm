from django.http import Http404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from TestBlock.models import TestBlock
from TestBlock.serializers import TestBlockSerializersDetail, TestBlockSerializersOptimize


class TestBlockViewSet(viewsets.ViewSet):
    queryset = TestBlock.objects.all()
    permission_classes = [IsAuthenticated]

    def list(self):
        """ Возвращает список всех вопросов и ответов. Доступно всем аутентифицированным пользователям. """
        test_blocks = TestBlock.objects.all()
        blocks_serializer = TestBlockSerializersOptimize(test_blocks, many=True)
        data = {
            'questions_test_blocks': blocks_serializer.questions,
            'answers_test_blocks': blocks_serializer.answers,
        }
        return Response(data)

    def retrieve_test_block(self, pk=None):
        """ Получение информации о конкретном тестовом блоке. Доступно всем аутентифицированным пользователям. """
        try:
            test_block = TestBlock.objects.get(pk=pk)
            blocks_serializer = TestBlockSerializersDetail(test_block)
            data = {
                'questions_test_blocks': blocks_serializer.questions,
                'answers_test_blocks': blocks_serializer.answers,
            }
            return Response(data)
        except TestBlock.DoesNotExist:
            raise Http404

    @action(detail=True, methods=['post'])
    def reset_answers(self, request, pk=None):
        try:
            test_block = TestBlock.objects.get(id=pk)
            test_block.answers.clear()
            test_block.save()
            serializer = TestBlockSerializersDetail(test_block)
            return Response(serializer.data)
        except TestBlock.DoesNotExist:
            raise Http404

    # @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    # def reset_answers(self):
    #     block = self.get_object()
    #     block.answers = []
    #     block.save(update_fields=['answers'])
    #     return response.Response({"detail": "Ответы были успешно сброшены."}, status=response.status.HTTP_200_OK)
