import datetime
import math
from loguru import logger

from django.utils import timezone
from django.utils.decorators import method_decorator
from django.db.models import Q
from rest_framework import permissions, status, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.renderers import MultiPartRenderer, JSONRenderer
from query_counter.decorators import queries_counter

from lessons import models, serializers
from lessons import viewsets as own_viewsets
from lessons.permissions import (
    IsAdminOrIsStaff,
    CanReadCourse,
    CanReadLesson,
    CanReadStep,
    CanReadBlock,
    CanReadUserStory,
    CanReadLessonStory,
    CanReadSCORM,
    InCover,
    )
from users.models import WorkExperience


@method_decorator(queries_counter, name='dispatch')
class EventCoveredViewSet(mixins.ListModelMixin,
                          mixins.CreateModelMixin,
                          mixins.DestroyModelMixin,
                          viewsets.GenericViewSet):
    """
    Виюв сет покрытия эвента
    """
    queryset = (models.EventCovered
                ._default_manager
                .get_queryset())
    serializer_class = serializers.EventCoveredSerializer
    lookup_field = "pk"
    lookup_url_kwarg = "cover_id"

    def get_permissions(self):
        logger.debug(f"action is {self.action}")
        if self.action == "toggle_favorite":
            permission_classes = [permissions.IsAuthenticated &
                                  (InCover | IsAdminOrIsStaff)]
        elif self.action in ['currents', 'register']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        logger.debug(f"permisson class now {permission_classes}")
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        self.serializer_class = serializers.EventCoveredCreateSerializer
        return super().create(request, *args, **kwargs)

    @action(detail=True, url_path="toggle-favorite")
    def toggle_favorite(self, request, cover_id=None):
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
        covers = queryset.filter(user=user)
        page = self.paginate_queryset(covers)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def registration(self, request, cover_id=None):
        self.serializer_class = serializers.EventCoveredCreateSerializer
        self.serializer_class.Meta.read_only_fields.append('user')
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@method_decorator(queries_counter, name='dispatch')
class EventViewSet(mixins.ListModelMixin,
                   own_viewsets.GetCreateUpdateDeleteViewSet):
    """
    Виювсет эвента
    """
    queryset = (models.Event
                ._default_manager
                .get_queryset().select_related('course'))
    serializer_class = serializers.EventSerializer
    lookup_field = "pk"
    lookup_url_kwarg = "event_id"
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        logger.debug(f"action is {self.action}")
        if self.action in ["list"]:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        logger.debug(f"permisson class now {permission_classes}")
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = serializers.EventViewSerializer
        self.queryset = self.queryset.select_related('course')
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        if self.request.user.is_staff or self.request.user.is_superuser:
            self.queryset = self.queryset.select_related('course')
        else:
            user = self.request.user
            profession = user.profession
            time_now = timezone.now()
            date_now = datetime.date(year=time_now.year, month=time_now.month, day=time_now.day)
            experience_years = math.floor((date_now - user.date_commencement).days / 365)
            experience = WorkExperience._default_manager.get_or_create(years=experience_years)
            self.queryset = self.queryset.filter(Q(course__experiences=experience) &
                                                 Q(course__profession=profession) &
                                                 ~Q(course__beginner=True))
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        self.serializer_class = serializers.EventSerializerCreate
        return super().create(request)

    def update(self, request, *args, **kwargs):
        self.serializer_class = serializers.EventSerializerUpdate
        return super().update(request)


# @method_decorator(queries_counter, name='dispatch')
class CourseViewSet(mixins.ListModelMixin,
                    own_viewsets.GetCreateUpdateDeleteViewSet,
                    ):
    """
    Виювсет CRUD Курса
    """

    queryset = models.Course._default_manager.get_queryset()
    lookup_field = "pk"
    lookup_url_kwarg = "course_id"
    renderer_classes = [JSONRenderer, MultiPartRenderer]

    def get_permissions(self):
        logger.debug(f"action is {self.action}")
        if self.action == "retrieve":
            permission_classes = [
                permissions.IsAuthenticated &
                (CanReadCourse | IsAdminOrIsStaff)
            ]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        logger.debug(f"permisson class now {permission_classes}")
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            serializer_class = serializers.ViewCourseSerializer
            self.queryset = self.queryset.select_related('lessons')
            self.queryset = (self.queryset
                             .select_related('profession')
                             .prefetch_related('experiences'))
        elif self.action in ['update', 'create', 'partial_update']:
            serializer_class = serializers.CreateCourseSerializer
        else:
            serializer_class = serializers.CourseSerializer
        return serializer_class

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)

    def custom_create(self, request, course):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['POST'])
    def run(self, request, course_id=None):
        self.serializer_class = serializers.EventSerializerCreate
        # Monkey Patch
        # Спартанское латание
        self.create = self.custom_create
        course = self.get_object()
        return self.create(request=request, course=course)


# @method_decorator(queries_counter, name='dispatch')
class LessonViewSet(viewsets.ModelViewSet):
    """
    Вьюсет уроков с выбором сериализатора для CRUD-операций
    """
    queryset = models.Lesson.objects.all()
    serializer_class = serializers.LessonSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'lesson_id'

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
            logger.debug(self.request.data)
            return serializers.LessonCreateSerializer
        return serializers.LessonSerializer

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        instance = serializer.save(teacher=self.request.user)
        models.TestBlock._default_manager.create(
            lesson=instance,
        )

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)


# @method_decorator(queries_counter, name='dispatch')
class SCROMViewSet(mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = models.SCORM._default_manager.get_queryset()
    serializer_class = serializers.SCORMSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'scorm_id'
    permission_classes = [permissions.IsAuthenticated &
                          (CanReadSCORM | IsAdminOrIsStaff)]


@method_decorator(queries_counter, name='dispatch')
class StepViewSet(ModelViewSet):
    """
    Просмотр всех шагов уроков list
    Создание нового шага урока
    Просмотр одного шага, Редактирование, удаление шага урока
    """

    queryset = models.Step._default_manager.get_queryset()
    lookup_field = "pk"
    lookup_url_kwarg = "step_id"

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [permissions.IsAuthenticated &
                                  (CanReadStep | IsAdminOrIsStaff)]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            serializer_class = serializers.StepViewSerializer
            self.queryset = (self.queryset
                             .select_related('attachments'))
        elif self.action in ['update', 'create', 'partial_update']:
            serializer_class = serializers.StepCreateSerializer
        else:
            serializer_class = serializers.StepSerializer
        return serializer_class


# @method_decorator(queries_counter, name='dispatch')
class TestBlockViewSet(mixins.RetrieveModelMixin,
                       viewsets.GenericViewSet):
    """
    Тестовый блок виювсет
    """
    queryset = models.TestBlock._default_manager.get_queryset()
    serializer_class = serializers.TestBlockSerializersOptimize
    lookup_field = 'pk'
    lookup_url_kwarg = 'block_id'

    def get_permissions(self):
        if self.action in ["retrieve",
                        #    "reset",
                           ]:
            permission_classes = [permissions.IsAuthenticated &
                                  (CanReadBlock | IsAdminOrIsStaff)]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            serializer_class = serializers.TestBlockSerializersDetail
            self.queryset = (self.queryset
                             .select_related('questions'))
        else:
            serializer_class = serializers.TestBlockSerializersOptimize
        return serializer_class

    # @action(methods=['delete'], detail=True)
    # def reset(self, request, block_id=None):
    #     obj = self.get_object()
    #     Здесь логика с UserStory


# @method_decorator(queries_counter, name='dispatch')
class QuestionViewSet(viewsets.ModelViewSet):
    """
    Виювсет вопроса
    """
    queryset = models.Question._default_manager.get_queryset()
    permission_classes = [IsAdminOrIsStaff]
    lookup_field = 'pk'
    lookup_url_kwarg = 'question_id'

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            serializer_class = serializers.QuestionCreateSerializer
        else:
            serializer_class = serializers.QuestionSerializer
        return serializer_class

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


# @method_decorator(queries_counter, name='dispatch')
class AnswerViewSet(viewsets.ModelViewSet):
    """
    Виювсет ответов
    """
    queryset = models.Answer._default_manager.get_queryset()
    permission_classes = [IsAdminOrIsStaff]
    serializer_class = serializers.AnswerSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'answer_id'


# @method_decorator(queries_counter, name='dispatch')
class UserStoryViewSet(viewsets.ModelViewSet):
    queryset = models.UserStory.objects.all()
    permission_classes = [IsAdminOrIsStaff]
    serializer_class = serializers.UserStorySerializer

    def get_permissions(self):
        if self.action in ["retrieve",
                           ]:
            permission_classes = [permissions.IsAuthenticated &
                                  (CanReadUserStory | IsAdminOrIsStaff)]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        return [permission() for permission in permission_classes]


# @method_decorator(queries_counter, name='dispatch')
class LessonStoryViewSet(viewsets.ModelViewSet):
    queryset = models.LessonStory.objects.all()
    permission_classes = [IsAdminOrIsStaff]
    serializer_class = serializers.LessonStorySerializer

    def get_permissions(self):
        if self.action in ["retrieve",
                           ]:
            permission_classes = [permissions.IsAuthenticated &
                                  (CanReadLessonStory | IsAdminOrIsStaff)]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        return [permission() for permission in permission_classes]
