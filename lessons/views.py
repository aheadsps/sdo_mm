from rest_framework import generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from lessons import models, serializers
from lessons import viewsets as own_viewsets
from lessons.models import TestBlock
from lessons.permissions import IsAdminOrIsStaff
from lessons.serializers import TestBlockSerializersOptimize, TestBlockSerializersDetail


class EventViewSet(own_viewsets.GetUpdateDeleteViewSet):
    """
    Виювсет эвента
    """

    queryset = models.Event._default_manager.get_queryset()
    serializer_class = serializers.EventSerializer
    lookup_field = "pk"
    lookup_url_kwarg = "event_id"

    def get_permissions(self):
        if not self.action == "retrieve":
            permission_classes = [IsAdminOrIsStaff]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, permission_classes=[permissions.IsAuthenticated])
    def currents(self, request):
        """
        Получение текущих эвентов на пользователя
        """
        user = request.user
        queryset = self.filter_queryset(self.get_queryset())
        events = queryset.filter(user=user)
        page = self.paginate_queryset(events)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TestBlockListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TestBlockSerializersOptimize()
    queryset = TestBlock.objects.all()


class TestBlockRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestBlockSerializersDetail()
    queryset = TestBlock.objects.all()

# class TestBlockViewSet(viewsets.ViewSet):
#     """
#     Вьюха с реализацией получения списка вопросов и ответов, информации о конкретном тестовом блоке и сброса ответов
#     """
#     queryset = TestBlock.objects.all()
#     permission_classes = [IsAuthenticated]
#
#     def list(self):
#         """
#         Возвращает список всех вопросов и ответов. Доступно всем аутентифицированным пользователям.
#         """
#         test_blocks = TestBlock.objects.all()
#         blocks_serializer = TestBlockSerializersOptimize(test_blocks, many=True)
#         data = {
#             "questions_test_blocks": blocks_serializer.questions,
#             "answers_test_blocks": blocks_serializer.answers,
#         }
#         return Response(data)
#
#     def retrieve_test_block(self, pk=None):
#         """
#         Получение информации о конкретном тестовом блоке. Доступно всем аутентифицированным пользователям.
#         """
#         try:
#             test_block = TestBlock.objects.get(pk=pk)
#             blocks_serializer = TestBlockSerializersDetail(test_block)
#             data = {
#                 "questions_test_blocks": blocks_serializer.questions,
#                 "answers_test_blocks": blocks_serializer.answers,
#             }
#             return Response(data)
#         except TestBlock.DoesNotExist:
#             raise Http404
#
#     @action(detail=True, methods=["post"])
#     def reset_answers(self, request, pk=None):
#         """
#         Сброс ответов. Доступно всем аутентифицированным пользователям.
#         """
#         try:
#             test_block = TestBlock.objects.get(id=pk)
#             test_block.answers.clear()
#             test_block.save()
#             serializer = TestBlockSerializersDetail(test_block)
#             return Response(serializer.data)
#         except TestBlock.DoesNotExist:
#             raise Http404
