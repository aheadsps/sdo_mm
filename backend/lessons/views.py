from loguru import logger
from rest_framework import permissions, status, mixins, generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from lessons import models, serializers
from lessons import viewsets as own_viewsets
from lessons.models import TestBlock
from lessons.permissions import (CanReadCourse, IsAdminOrIsStaff,
                                 OwnerEventPermission)
from lessons.serializers import (TestBlockSerializersDetail,
                                 TestBlockSerializersOptimize)
from lessons.permissions import (
    IsAdminOrIsStaff,
    OwnerEventPermission,
    CanReadCourse,
    CanReadLesson
    )


class TestBlockGeneric(generics.RetrieveAPIView):
    queryset = models.TestBlock.objects.get_queryset()
    serializer_class = serializers.TestBlockSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'block_id'
    permission_classes = [permissions.AllowAny]


class EventViewSet(own_viewsets.GetCreateUpdateDeleteViewSet):
    """
    Виювсет эвента
    """
    queryset = (models.Event
                ._default_manager
                .get_queryset()
                .select_related('course'))
    serializer_class = serializers.EventSerializer
    lookup_field = "pk"
    lookup_url_kwarg = "event_id"
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        logger.debug(f"action is {self.action}")
        if self.action in ["retrieve", "toggle-favorite"]:
            permission_classes = [
                (permissions.IsAuthenticated & OwnerEventPermission) | IsAdminOrIsStaff
            ]
        elif self.action == "currents":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated & IsAdminOrIsStaff]
        logger.debug(f"permisson class now {permission_classes}")
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        self.serializer_class = serializers.EventSerializerCreate
        return super().create(request, *args, **kwargs)

    @action(detail=True, url_path="toggle-favorite")
    def toggle_favorite(self, request, event_id=None):
        """
        Изменение статуса избранного
        """
        obj = self.get_object()
        logger.debug(f"current favorite is {obj.favorite}")
        obj.favorite = not obj.favorite
        obj.save()
        logger.debug(f"after favorite is {obj.favorite}")
        return Response(
            dict(favorite=obj.favorite),
            status=status.HTTP_200_OK,
        )

    @action(detail=False)
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


class StepViewSet(ModelViewSet):
    """
    Просмотр всех шагов уроков list
    Создание нового шага урока
    Просмотр одного шага, Редактирование, удаление шага урока
    """

    queryset = models.Step._default_manager.all()
    serializer_class = serializers.StepSerializer

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        return [permission() for permission in permission_classes]


class CourseViewSet(mixins.ListModelMixin,
                    own_viewsets.GetCreateUpdateDeleteViewSet,
                    ):
    """
    Виювсет CRUD Курса
    """

    queryset = (
        models.Course._default_manager.get_queryset()
        .select_related("profession")
        .prefetch_related("experiences")
    )
    serializer_class = serializers.ViewCourseSerializer
    lookup_field = "pk"
    lookup_url_kwarg = "course_id"
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        logger.debug(f"action is {self.action}")
        if self.action == "retrieve":
            permission_classes = [
                (permissions.IsAuthenticated & CanReadCourse) | IsAdminOrIsStaff
            ]
        else:
            permission_classes = [permissions.IsAuthenticated & IsAdminOrIsStaff]
        logger.debug(f"permisson class now {permission_classes}")
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        self.serializer_class = serializers.CreateCourseSerializer
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = serializers.CreateCourseSerializer
        return super().update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        self.queryset = models.Course._default_manager.get_queryset()
        self.serializer_class = serializers.CourseSerializer
        return super().list(request, *args, **kwargs)


class TestBlockListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TestBlockSerializersOptimize
    queryset = TestBlock.objects.all()


class TestBlockRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestBlockSerializersDetail
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


class LessonViewSet(viewsets.ModelViewSet):
    """
    Вьюсет уроков с выбором сериализатора для CRUD-операций
    """
    queryset = models.Lesson.objects.all()
    serializer_class = serializers.LessonSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'lesson_id'
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticated &
                                  (CanReadLesson | IsAdminOrIsStaff)]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]

        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        """
        Возвращает сериализатор в зависимости от действия (action).
        """
        if self.action == 'retrieve':
            return serializers.LessonViewSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return serializers.LessonCreateSerializer
        return serializers.LessonSerializer

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)
