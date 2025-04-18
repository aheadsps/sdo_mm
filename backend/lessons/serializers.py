import datetime
import re

from typing import TypeVar

from rest_framework import serializers
from rest_framework.validators import ValidationError
from django.db.utils import IntegrityError
from django.utils import timezone
from django.db.transaction import atomic
from loguru import logger

from lessons import models, validators
from lessons.d_types import VD
from lessons.patrials import set_status
from lessons.scorm import SCORMLoader
from lessons.utils import parse_exeption_error
from lessons.servises import SetEventServise
from lessons.scorm.engine.exceptions import SCORMExtractError, ManifestNotSetupError
from users import serializers as user_serializers


T = TypeVar("T")


PROCESS = "process"
EXPECTED = "expected"
DONE = "done"
FAILED = "failed"


class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserStory
        fields = ["id", "user", "answer", "test_block", "date_opened"]
        read_only_fields = ["id", "user", "date_opened"]

    def validate(self, data):
        validators.UserStoryValidator(
            answer=data.get("answer"), test_block=data.get("test_block")
        )()
        return data


class LessonStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LessonStory
        fields = ["id", "course", "lesson", "user", "date_opened"]
        read_only_fields = ["user", "date_opened"]

    def validate(self, data):
        validators.LessonStoryValidator(
            course=data.get("course"), lesson=data.get("lesson")
        )()
        return data


class AnswerSerializer(serializers.ModelSerializer):
    """
    Сериализатор Answer
    """

    correct = serializers.BooleanField(write_only=True)

    class Meta:
        model = models.Answer
        fields = (
            "id",
            "text",
            "correct",
            "question",
        )


class QuestionSerializer(serializers.ModelSerializer):
    """
    Сериализатор Question
    """

    answers = AnswerSerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = models.Question
        fields = ("id", "teacher", "text", "image", "weight", "answers")

    # def create(self, validated_data: dict[str, str]):
    #     """
    #     Получение возможности создавать вопрос сразу с ответами
    #     """

    #     answers = validated_data.pop("answers")
    #     question = models.Question._default_manager.create(**validated_data)
    #     answers_models = [
    #         models.Answer(**answer, question=question) for answer in answers
    #     ]
    #     models.Answer._default_manager.bulk_create(answers_models)
    #     return question


class QuestionCreateSerializer(serializers.ModelSerializer):
    """
    Создание вопроса
    """

    class Meta:
        model = models.Question
        fields = ("id", "teacher", "text", "image", "weight", "test_block")
        read_only_fields = ("id", 'teacher',)


class ContentAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContentAttachment
        fields = ["id", "file", "file_type", "step", 'materials']
        validators = (validators.AttachmentValidator('step', 'materials'),)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        if instance.file:
            response['file'] = instance.file.url
        return response


class MaterialsSerializer(serializers.ModelSerializer):

    files = ContentAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = models.Materials
        fields = ("id", 'files',)


class StepSerializer(serializers.ModelSerializer):
    """
    Шаги - оптимизированный
    """

    attachments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Step
        fields = (
            "id",
            "teacher",
            "serial",
            "title",
            "content_text",
            "attachments",
            "lesson",
        )


class StepCreateSerializer(serializers.ModelSerializer):
    """
    Шаги создание
    """

    class Meta:
        model = models.Step
        fields = (
            "id",
            "teacher",
            "serial",
            "title",
            "content_text",
            "lesson",
        )
        validators = (validators.MoreThanZeroValidator("serial"),
                      validators.StepSerialValidator('serial', 'lesson'),
                      )
        read_only_fields = ('id', 'teacher',)

    # def create(self, validated_data: dict[int, str, str, dict]):
    #     """
    #     Создаем новый шаг урока
    #     """
    #     content_attachment = validated_data.pop("attachments")
    #     step = models.Step._default_manager.create(**validated_data)
    #     # Заполняем поле content_attachment
    #     content_attachment_models = []
    #     for item in content_attachment:
    #         content_attachment_models.append(
    #             models.ContentAttachment(**item, step=step)
    #         )
    #     models.ContentAttachment._default_manager.bulk_create(content_attachment_models)
    #     return step

    # def update(self, instance, validated_data):
    #     """
    #     Обработка обновления Step.

    #     ContentAttachment не редактируется:
    #     создается новый или удаляется
    #     В API-запросе необходимо передать
    #     ВСЕ актуальные записи ContentAttachment вместе с их ID
    #     Если запись передана не будет - она удаляется из БД.
    #     Если ID = null или не указан создается новая запись
    #     """

    #     # Определяем поля Step
    #     instance.serial = validated_data.get("serial", instance.serial)
    #     instance.title = validated_data.get("title", instance.title)
    #     instance.content_text = validated_data.get(
    #         "content_text", instance.content_text
    #     )

    #     # Получаем ID удаленных content_attachment
    #     id_attachment_new = [
    #         item.get("id")
    #         for item in validated_data.get("attachments")
    #         if not item.get("id") is None
    #     ]
    #     id_attachment_old = [item.id for item in instance.attachments.all()]
    #     id_attachment_delete = set(id_attachment_old) - set(id_attachment_new)
    #     # Удалить старые content_attachment
    #     delete_list = models.ContentAttachment.objects.filter(
    #         id__in=list(id_attachment_delete)
    #     )
    #     for item in delete_list:
    #         if item.file.name:
    #             file_path = item.file.name.split("/")
    #             file_path = os.path.join(MEDIA_ROOT, *file_path)
    #             try:
    #                 os.remove(file_path)
    #             except Exception:
    #                 # запись в логи...
    #                 pass
    #     delete_list.delete()

    #     # Заполняем новые поля content_attachment
    #     content_attachment_models = []
    #     for item in validated_data.get("attachments"):
    #         if not item.get("id", None):
    #             content_attachment_models.append(
    #                 models.ContentAttachment(**item, step=instance)
    #             )
    #     models.ContentAttachment._default_manager.bulk_create(content_attachment_models)

    #     instance.save()

    #     return instance


class CalendarSerializer(serializers.Serializer):
    """
    Сериализатор календаря
    """
    name = serializers.CharField()
    start_date = serializers.DateTimeField()


class StepViewSerializer(serializers.ModelSerializer):
    """
    Шаг детальный
    """

    attachments = ContentAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = models.Step
        fields = (
            "id",
            "serial",
            "teacher",
            "title",
            "content_text",
            "lesson",
            "attachments",
        )


class TestBlockSerializersOptimize(serializers.ModelSerializer):
    """
    Сериалайзер оптимизированный
    """

    questions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.TestBlock
        fields = "__all__"


class TestBlockSerializersDetail(serializers.ModelSerializer):
    """
    Сериалайзер детальный с логикой получения user_story,
    создания и обновления существующих записей.
    """

    questions = QuestionSerializer(many=True)
    user_story = UserStorySerializer(many=True)

    class Meta:
        model = models.TestBlock
        fields = "__all__"


class LessonCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор создания и обновления урока
    """

    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "teacher",
            "name",
            "serial",
            "course",
            "started",
            "start_date",
        )
        read_only_fields = ("id", "teacher", "started", "start_date")
        validators = (validators.LessonScormValidator("course"),
                      validators.LessonSerialValidator('serial', 'course',),
                      )


class LessonSerializer(serializers.ModelSerializer):
    """
    Сериализатор оптимизированного вывода
    """

    steps = serializers.SerializerMethodField()
    test_block = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "teacher",
            "name",
            "serial",
            "version",
            "started",
            "resourse",
            "start_date",
            "course",
            "steps",
            "test_block",
        )

    def get_steps(self, obj):
        steps = models.Step._default_manager.filter(lesson=obj)
        return StepSerializer(steps, many=True).data


class LessonViewSerializer(serializers.ModelSerializer):
    """
    Сериализатор детального представления урока
    """

    steps = serializers.SerializerMethodField()
    test_block = TestBlockSerializersDetail()

    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "teacher",
            "name",
            "serial",
            "version",
            "started",
            "resourse",
            "start_date",
            "course",
            "steps",
            "test_block",
        )

    def get_steps(self, obj):
        steps = models.Step._default_manager.filter(lesson=obj)
        return StepViewSerializer(steps, many=True).data


class ZIPFileField(serializers.FileField):

    def to_internal_value(self, data):
        self.error_messages.update(non_zip="File need to be zip format")
        try:
            file_name = data.name
            file_size = data.size
        except AttributeError:
            self.fail("invalid")
        if not re.match(r"\S*.zip", file_name):
            self.fail("non_zip")

        if not file_name:
            self.fail("no_name")
        if not self.allow_empty_file and not file_size:
            self.fail("empty")
        if self.max_length and len(file_name) > self.max_length:
            self.fail("max_length", max_length=self.max_length, length=len(file_name))

        return data


class CreateCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор на обработку создания и обновления курсов
    """

    scorm = ZIPFileField(required=False)
    materials = MaterialsSerializer(read_only=True)

    class Meta:
        model = models.Course
        fields = (
            "id",
            "teacher",
            "name",
            "description",
            "interval",
            "beginner",
            "image",
            "profession",
            "scorm",
            "is_scorm",
            "lessons",
            "experiences",
            "status",
            'materials',
        )
        validators = (
            validators.CourseScormValidator("scorm"),
            validators.IntervalValidator("beginner", "interval"),
        )
        read_only_fields = ("teacher", "status", "lessons",)

    def create(self, validated_data: dict):
        logger.debug(validated_data)
        zip_scorm = validated_data.pop("scorm", None)
        if zip_scorm:
            validated_data['status'] = 'edit'
            validated_data['is_scorm'] = True
            try:
                with atomic():
                    course = SCORMLoader(zip_archive=zip_scorm).save(
                        self.Meta.model,
                        validated_data,
                    )
            except IntegrityError as er:
                raise ValidationError(
                    dict(scorm=f"This SCORM packpage {parse_exeption_error(er)}")
                )
            except (SCORMExtractError, ManifestNotSetupError) as er:
                raise ValidationError(dict(scorm=er))
        else:
            course = super().create(validated_data)
        models.Materials._default_manager.create(course=course)
        return course

    def update(self, instance, validated_data):
        validated_data['status'] = 'archive'
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        if instance.image:
            response['image'] = instance.image.url
        return response


class CourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор Оптимизированого вывода
    """

    materials = MaterialsSerializer(read_only=True)

    class Meta:
        model = models.Course
        fields = (
            "id",
            "teacher",
            "name",
            "description",
            "interval",
            "beginner",
            "create_date",
            "update_date",
            "image",
            "is_scorm",
            "profession",
            "experiences",
            "lessons",
            "status",
            "materials",
        )

    def to_representation(self, instance):
        response = super().to_representation(instance)
        if instance.image:
            response['image'] = instance.image.url
        return response


class ViewCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор вывода детального курса
    """

    experiences = user_serializers.WorkExperienceSerializer(many=True)
    profession = user_serializers.ProfessionSerializer()
    lessons = serializers.SerializerMethodField()
    materials = MaterialsSerializer(read_only=True)

    class Meta:
        model = models.Course
        fields = (
            "id",
            "teacher",
            "name",
            "description",
            "interval",
            "beginner",
            "create_date",
            "update_date",
            "image",
            "status",
            "is_scorm",
            "profession",
            "experiences",
            "lessons",
            "materials",
        )

    def get_lessons(self, obj):
        lessons = models.Lesson._default_manager.filter(course=obj)
        return LessonSerializer(lessons, many=True).data

    def to_representation(self, instance):
        response = super().to_representation(instance)
        if instance.image:
            response['image'] = instance.image.url
        return response


class EventViewSerializer(serializers.ModelSerializer):
    """
    Сериализатор Эвента
    """

    course = ViewCourseSerializer()

    class Meta:
        model = models.Event
        fields = (
            "id",
            "course",
            "start_date",
            "end_date",
            "status",
        )


class EventSerializer(serializers.ModelSerializer):
    """
    Сериализатор Эвента
    """

    course = CourseSerializer()

    class Meta:
        model = models.Event
        fields = (
            "id",
            "course",
            "start_date",
            "end_date",
            "status",
        )


class EventSerializerCreate(serializers.ModelSerializer):
    """
    Сериализатор Создания в Изменения Эвента
    """

    status = serializers.CharField(read_only=True)

    class Meta:
        model = models.Event
        fields = (
            "id",
            "course",
            "start_date",
            "end_date",
            "status",
        )
        validators = (
            validators.StatusEditValidator('course'),
            validators.SingleEventValidator("course"),
            validators.BeginnerValidator("course", "start_date"),
            validators.TimeValidator("start_date"),
            validators.EmptyLessonsValidator('course'),
        )
        read_only_fields = ("id", "status", "end_date")

    def create(self, validated_data):
        instance = super().create(validated_data)
        event = (models.Event.
                 _default_manager.
                 filter(pk=instance.pk).
                 select_related('course').
                 prefetch_related('course__lessons')
                 ).get()
        with atomic():
            SetEventServise(instance=event).set_event_settings()
        instance.refresh_from_db()
        return instance


class EventSerializerUpdate(serializers.ModelSerializer):
    """
    Сериализатор Создания в Изменения Эвента
    """

    status = serializers.CharField(read_only=True)

    class Meta:
        model = models.Event
        fields = (
            "id",
            "course",
            "start_date",
            "end_date",
            "status",
        )
        validators = (
            validators.BeginnerValidator("course", "start_date"),
            validators.TimeValidator("start_date"),
        )
        read_only_fields = (
            "id",
            "course",
            "status",
            "end_date",
        )

    def _is_process(self, start_date: datetime.datetime) -> bool:
        """
        Определение является курс запущенным
        """
        time_now = timezone.now()
        return time_now > start_date

    def _change_status(self, validated_data: VD, process: bool) -> None:
        """
        Изменение статуса
        """
        set_status(
            dict_data=validated_data,
            value=PROCESS if process else EXPECTED,
        )

    def _correct_status(self, validated_data: VD) -> VD:
        """
        Корректировка статуса исходя от даты начала
        """
        start_date = validated_data.get("start_date")
        if start_date:
            is_process = self._is_process(start_date=start_date)
            if self.instance:
                if self.instance.status not in [DONE, FAILED]:
                    self._change_status(
                        validated_data=validated_data,
                        process=is_process,
                    )
                return
            else:
                self._change_status(
                    validated_data=validated_data,
                    process=is_process,
                )

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        event = (models.Event.
                 _default_manager.
                 filter(pk=instance.pk).
                 select_related('course').
                 prefetch_related('course__lessons')
                 ).get()
        self._correct_status(validated_data)
        SetEventServise(instance=event, update=True).set_event_settings()
        instance.refresh_from_db()
        return instance


class EventCoveredSerializer(serializers.ModelSerializer):
    """
    Сериализатор покрытия эвентами
    """

    event = EventSerializer(read_only=True)

    class Meta:
        model = models.EventCovered
        fields = (
            "id",
            "user",
            "event",
            "favorite",
            "procent",
            "status",
        )


class EventCoveredViewSerializer(serializers.ModelSerializer):
    """
    Сериализатор покрытия эвентами упрощенный
    """
    user = user_serializers.UserSerializer(read_only=True)

    class Meta:
        model = models.EventCovered
        fields = (
            "id",
            "user",
            "event",
            "favorite",
            "procent",
            "status",
        )


class UsersStatSerializer(serializers.Serializer):
    """
    Сериализатор покрытия эвентами упрощенный
    """
    user = user_serializers.UserSerializer(read_only=True)
    procent = serializers.IntegerField()
    status = serializers.CharField()


class MainLessonsSerializer(serializers.HyperlinkedModelSerializer):
    """
    Сериализатор для Main страницы Lessons
    """
    url = serializers.HyperlinkedIdentityField(
        view_name='lessons:lesson-detail',
        lookup_url_kwarg='lesson_id',
    )

    class Meta:
        model = models.Lesson
        fields = (
            'url',
            'id',
            'name',
            'end_date',
        )


class CourseDetailSerializer(serializers.Serializer):
    """
    Детали курса
    """
    name = serializers.CharField()
    description = serializers.CharField()
    create_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    count_students = serializers.IntegerField()
    status = serializers.CharField()
    teacher = user_serializers.UserSerializer()


class EventCoveredCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор создания покрытия эвентами
    """

    class Meta:
        model = models.EventCovered
        fields = (
            "id",
            "user",
            "event",
            "favorite",
            "procent",
            "status",
        )
        read_only_fields = ["id", "procent", "status"]
        validators = (
            validators.PassRegistationsValidator("event", "user"),
            validators.RegistrationValidator("user", "event"),
        )
