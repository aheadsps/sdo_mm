import datetime
import math
from django.db import transaction
from loguru import logger

from django.utils import timezone
from django.utils.decorators import method_decorator
from django.db.models import Q, QuerySet
from django.db.transaction import atomic
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.renderers import MultiPartRenderer, JSONRenderer
from rest_framework.validators import ValidationError
from rest_framework import filters
from query_counter.decorators import queries_counter

from lessons import models, serializers
from lessons import viewsets as own_viewsets
from lessons.scorm import SCORMLoader
from lessons.servises import SetEventServise
from lessons.permissions import (
    IsAdminOrIsStaff,
    CanReadCourse,
    CanReadLesson,
    CanReadStep,
    CanReadBlock,
    CanReadUserStory,
    CanReadLessonStory,
    InCover,
    CurrentTeacher,
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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'favorite']

    def get_permissions(self):
        logger.debug(f"action is {self.action}")
        if self.action == "toggle_favorite":
            permission_classes = [permissions.IsAuthenticated &
                                  (InCover | IsAdminOrIsStaff)]
        elif self.action in ['currents', 'create', 'calendar', 'main']:
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

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        return super().list(request, *args, **kwargs)

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
        self.check_object_permissions(request, None)
        user = request.user
        queryset = self.filter_queryset(self.get_queryset())
        covers = queryset.filter(user=user)
        page = self.paginate_queryset(covers)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def calendar(self, request):
        """
        Получение календаря событий по датам
        """
        self.check_object_permissions(request, None)
        self.serializer_class = serializers.CalendarSerializer
        time_now = timezone.now()
        user = request.user
        queryset = (self.queryset.
                    filter(Q(user=user)).prefetch_related('event__course'))
        logger.debug(f'calendar queryset is {queryset}')
        qfilter = Q(*[Q(course=cover.event.course, course__beginner=False) for cover in queryset], _connector=Q.OR)
        lessons = models.Lesson._default_manager.filter(qfilter, Q(start_date__gte=time_now)).values('name', 'start_date')
        logger.debug(f'calendar lessons is {lessons}')
        course_story = []
        for cover in queryset:
            if cover.status == 'expected':
                course_story.append(dict(name='Курс ' + cover.event.course.name,
                                         start_date=cover.event.start_date,
                                         ))
        logger.debug(f'after courses {course_story}')
        for lesson in lessons:
            course_story.append(dict(name='Урок ' + lesson['name'],
                                     start_date=lesson['start_date'],
                                     ))
        logger.debug(f'after lessons {course_story}')
        if queryset:
            calendar = sorted(course_story,
                              key=lambda x: x['start_date'])
        else:
            calendar = []
        logger.debug(f'after sorting {calendar}')
        serializer = self.get_serializer(calendar, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def main(self, request):
        """
        Для страницы Main
        """
        self.check_object_permissions(request, None)
        serializer_class = serializers.MainLessonsSerializer
        user = request.user
        queryset: QuerySet = (self.get_queryset()
                              .filter(user=user)
                              .select_related('event__course')
                              .all())
        logger.debug(f'main page queryset {queryset}')
        qfilter = Q(*[Q(course=cover.event.course)
                      for cover
                      in queryset],
                    _connector=Q.OR)
        lessons = (models.Lesson._default_manager
                   .filter(qfilter & Q(started=True))
                   .order_by('end_date'))
        logger.debug(f'main page lessons {lessons}')
        serializer = serializer_class(lessons,
                                      many=True,
                                      context=dict(request=request),
                                      )
        return Response(serializer.data)


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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with atomic():
            SetEventServise(instance).delete_event_settings()
            self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        if self.request.user.is_staff or self.request.user.is_superuser:
            self.queryset = self.queryset.select_related('course')
        else:
            user = self.request.user
            profession = user.profession
            time_now = timezone.now()
            date_now = datetime.date(year=time_now.year, month=time_now.month, day=time_now.day)
            experience_years = math.floor((date_now - user.date_commencement).days / 365)
            experience = WorkExperience._default_manager.get_or_create(years=experience_years)[0]
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


@method_decorator(queries_counter, name='dispatch')
class CourseViewSet(mixins.ListModelMixin,
                    own_viewsets.GetCreateUpdateDeleteViewSet,
                    ):
    """
    Виювсет CRUD Курса
    """

    queryset = models.Course._default_manager.select_related('profession').prefetch_related('experiences')
    lookup_field = "pk"
    lookup_url_kwarg = "course_id"
    renderer_classes = [JSONRenderer, MultiPartRenderer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['create_date', 'status']
    search_fields = ['@name']

    def get_permissions(self):
        logger.debug(f"action is {self.action}")
        if self.action == "retrieve":
            permission_classes = [
                permissions.IsAuthenticated &
                (CanReadCourse | IsAdminOrIsStaff)
            ]
        elif self.action in ['partial_update', 'delete', 'retrieve', 'users', 'about']:
            permission_classes = [permissions.IsAuthenticated &
                                  (CurrentTeacher | permissions.IsAdminUser)]
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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_scorm:
            SCORMLoader.delete(name=instance.name)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        user = request.user
        if not user.is_superuser:
            self.queryset = self.queryset.filter(teacher=self.request.user)
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['POST'], url_path='upload-materials')
    def upload_materials(self, request, course_id=None):
        self.serializer_class = serializers.ContentAttachmentSerializer
        self.kwargs.setdefault('context', self.get_serializer_context())
        course = self.get_object()
        if course.teacher != request.user:
            raise ValidationError(detail=dict(user='Нет прав доcтупа'), code=403)
        materials = models.Materials._default_manager.get(course=course)
        request.data.update(materials=materials.pk)
        logger.debug(f'request data to save materials {request.data}')
        serializer = self.serializer_class(data=request.data, context=dict(request=request))
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True)
    def users(self, request, course_id=None):
        serializer_class = serializers.UsersStatSerializer
        self.kwargs.setdefault('context', self.get_serializer_context())
        users = (models.EventCovered
                 ._default_manager
                 .filter(event__course_id=course_id)
                 .select_related('user'))
        logger.debug(f'users for this course is {users}')
        serializer = serializer_class(users, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def about(self, request, course_id=None):
        serializer_class = serializers.CourseDetailSerializer
        self.kwargs.setdefault('context', self.get_serializer_context())
        event = (models.Event._default_manager
                 .filter(course_id=course_id)
                 .prefetch_related('course').get())
        logger.debug(event)
        students = event.covers.count()
        logger.debug(students)
        data = dict(
            name=event.course.name,
            description=event.course.description,
            create_date=event.course.create_date,
            end_date=event.end_date,
            count_students=students,
            status=event.course.status,
            teacher=event.course.teacher,
        )
        logger.debug(f'detail for this course is {data}')
        serializer = serializer_class(data)
        return Response(serializer.data)


@method_decorator(queries_counter, name='dispatch')
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

    def perform_destroy(self, instance):
        if not instance.course.is_scorm:
            instance.delete()
        else:
            raise ValidationError(dict(course='Не возможно удалить урок из скорм пакета'))

    def perform_create(self, serializer):
        instance = serializer.save(teacher=self.request.user)
        models.TestBlock._default_manager.create(
            lesson=instance,
        )

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)


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

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)

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


@method_decorator(queries_counter, name='dispatch')
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

    @action(methods=['post'], detail=True, url_path='submission')
    def submission(self, request, block_id=None):
        """ Энд поинт отправки ответа студента на вопрос из тест блока """
        test_block = self.get_object()
        user = request.user
        question = test_block.questions.filter(
            type_question__in=['task', 'essay']).first()

        if not question:
            return Response(
                {
                    "error": "В этом тест-блоке нет вопросов типа"
                             " task или essay"},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        data.pop('score', None)
        data['type_of'] = 'question'

        context = {
            'request': request,
            'test_block': test_block,
            'question': question
        }

        serializer = serializers.AssessmentSubmissionSerializer(data=data,
                                                                context=context
                                                                )
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            submission = serializer.save(
                test_block=test_block,
                student=user,
                teacher=None
            )

            if 'answer' in data:
                models.UserStory.objects.create(
                    user=user,
                    answer_id=data['answer'],
                    test_block=test_block
                )

        return Response(
            serializers.AssessmentSubmissionSerializer(submission).data,
            status=status.HTTP_201_CREATED
        )

    # @action(methods=['delete'], detail=True)
    # def reset(self, request, block_id=None):
    #     obj = self.get_object()
    #     Здесь логика с UserStory


@method_decorator(queries_counter, name='dispatch')
class QuestionViewSet(viewsets.ModelViewSet):
    """
    Виювсет вопроса
    """
    queryset = models.Question._default_manager.get_queryset()
    permission_classes = [IsAdminOrIsStaff]
    lookup_field = 'pk'
    lookup_url_kwarg = 'question_id'

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            serializer_class = serializers.QuestionCreateSerializer
        else:
            serializer_class = serializers.QuestionSerializer
        return serializer_class

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


@method_decorator(queries_counter, name='dispatch')
class AnswerViewSet(viewsets.ModelViewSet):
    """
    Виювсет ответов
    """
    queryset = models.Answer._default_manager.get_queryset()
    permission_classes = [IsAdminOrIsStaff]
    serializer_class = serializers.AnswerSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'answer_id'

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)


@method_decorator(queries_counter, name='dispatch')
class UserStoryViewSet(viewsets.ModelViewSet):
    queryset = models.UserStory.objects.all()
    permission_classes = [IsAdminOrIsStaff]
    serializer_class = serializers.UserStorySerializer

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)

    def get_permissions(self):
        if self.action in ["retrieve",
                           ]:
            permission_classes = [permissions.IsAuthenticated &
                                  (CanReadUserStory | IsAdminOrIsStaff)]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        return [permission() for permission in permission_classes]


@method_decorator(queries_counter, name='dispatch')
class LessonStoryViewSet(viewsets.ModelViewSet):
    queryset = models.LessonStory.objects.all()
    permission_classes = [IsAdminOrIsStaff]
    serializer_class = serializers.LessonStorySerializer

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().list(request, *args, **kwargs)

    def get_permissions(self):
        if self.action in ["retrieve",
                           ]:
            permission_classes = [permissions.IsAuthenticated &
                                  (CanReadLessonStory | IsAdminOrIsStaff)]
        else:
            permission_classes = [permissions.IsAuthenticated &
                                  IsAdminOrIsStaff]
        return [permission() for permission in permission_classes]


@method_decorator(queries_counter, name='dispatch')
class FileViewSet(mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    """
    Виюв сет файлов
    """
    queryset = models.ContentAttachment._default_manager.get_queryset()
    permission_classes = [permissions.IsAuthenticated & IsAdminOrIsStaff]
    lookup_field = 'pk'
    lookup_url_kwarg = 'file_id'
    serializer_class = serializers.ContentAttachmentSerializer

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request=request, obj=None)
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if instance.step:
            teacher = instance.step.teacher
        elif instance.materials:
            teacher = instance.materials.course.teacher
        else:
            teacher = None
        if not teacher and not user.is_superuser:
            raise ValidationError(detail=dict(user='Нет прав доступа'),)
        if teacher and not user.is_superuser and teacher != user:
            raise ValidationError(detail=dict(user='Нет прав доступа'),)
        return super().destroy(request, *args, **kwargs)
