from django.utils import timezone
from loguru import logger
from rest_framework import permissions, status, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from lessons import models, serializers
from lessons import viewsets as own_viewsets
from lessons.permissions import (
    IsAdminOrIsStaff,
    OwnerEventPermission,
    CanReadCourse,
    CanReadLesson,
    CanReadStep,
    CanReadBlock,
    CanReadUserStory,
    CanReadLessonStory,
    )


class EventViewSet(own_viewsets.GetCreateUpdateDeleteViewSet):
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
        if self.action in ["retrieve", "toggle-favorite"]:
            permission_classes = [
                permissions.IsAuthenticated &
                (OwnerEventPermission | IsAdminOrIsStaff)
            ]
            self.serializer_class = serializers.EventViewSerializer
        elif self.action == "currents":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        logger.debug(f"permisson class now {permission_classes}")
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset.select_related('course')
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        self.serializer_class = serializers.EventSerializerCreate
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = super().create(request, *args, **kwargs)

        if response.status_code == status.HTTP_201_CREATED:
            try:
                event = serializer.instance
                if event:
                    self._handle_lesson_stories(event)
                else:
                    event_id = response.data.get('id')
                    if event_id:
                        event = models.Event.objects.get(pk=event_id)
                        self._handle_lesson_stories(event)
            except Exception as e:
                logger.error(f"Error processing lessons: {str(e)}")
        return response

    def update(self, request, *args, **kwargs):
        self.serializer_class = serializers.EventSerializerCreate
        event = self.get_object()
        old_start_date = event.start_date
        response = super().update(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            updated_event = self.get_object()
            self._handle_lesson_stories(updated_event, old_start_date)

        return response

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

    def _handle_lesson_stories(self, event, old_start_date=None):
        """
        Обрабатка LessonStory в зависимости от даты начала события.
        - При создании: если дата в прошлом/настоящем → создаем первый урок
        - При обновлении:
        Если дата не менялась - ничего не делаем
        Если дата стала будущей - сбрасываем прогресс (удаляем уроки)
        Если дата стала прошлой - добавляем первый урок
         (только если нет других уроков)
        """
        user = event.user
        course = event.course
        now = timezone.now()

        if old_start_date is None:
            if event.start_date and event.start_date <= now:
                self._create_first_lesson(user, course)
            return

        if old_start_date == event.start_date:
            return

        if event.start_date and event.start_date > now:
            models.LessonStory.objects.filter(user=user,
                                              course=course).delete()
            return

        if event.start_date and event.start_date <= now:
            if not models.LessonStory.objects.filter(user=user,
                                                     course=course).exists():
                self._create_first_lesson(user, course)

    def _create_first_lesson(self, user, course):
        """
        Создает запись о первом уроке курса
        """
        first_lesson = course.lessons.order_by('serial').first()
        if first_lesson:
            models.LessonStory.objects.create(
                user=user,
                course=course,
                lesson=first_lesson
            )


class CourseViewSet(mixins.ListModelMixin,
                    own_viewsets.GetCreateUpdateDeleteViewSet,
                    ):
    """
    Виювсет CRUD Курса
    """

    queryset = models.Course._default_manager.get_queryset()
    lookup_field = "pk"
    lookup_url_kwarg = "course_id"

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

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)


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
            return serializers.LessonCreateSerializer
        return serializers.LessonSerializer

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)


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


class AnswerViewSet(viewsets.ModelViewSet):
    """
    Виювсет ответов
    """
    queryset = models.Answer._default_manager.get_queryset()
    permission_classes = [IsAdminOrIsStaff]
    lookup_field = 'pk'
    lookup_url_kwarg = 'answer_id'


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
