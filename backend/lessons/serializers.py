import datetime
import re

from django.db.models import Q
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
from lessons.scorm.engine.exceptions import SCORMExtractError, ManifestNotSetupError
from users import serializers as user_serializers

PROCESS = "process"
EXPECTED = "expected"
DONE = "done"
FAILED = "failed"


class CourseProgressSerializer(serializers.ModelSerializer):
    """
    Сериализатор прогресса студента в определенной точке курса
    """
    class Meta:
        model = models.CourseProgress
        fields = ("id",
                  "student",
                  "test_block",
                  "score",
                  "data_assessment",
                  "procent_compelete",
                  "result",
                  )
        readline = ("id",)


class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserStory
        fields = ('id', 'user', 'answer', 'test_block', 'date_opened')
        read_only_fields = ('id', 'user', 'date_opened')

    def validate(self, data):
        validators.UserStoryValidator(
            answer=data.get('answer'),
            test_block=data.get('test_block')
        )()
        return data


class LessonStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LessonStory
        fields = ('course', 'step', 'user', 'date_opened')
        read_only_fields = ('course', 'step', 'user', 'date_opened')

    # def validate(self, data):
    #     validators.LessonStoryValidator(
    #         course=data.get('course'),
    #         lesson=data.get('lesson')
    #     )()
    #     return data


class AnswerSerializer(serializers.ModelSerializer):
    """
    Сериализатор создания и обновления Answer
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
        validators = (validators.QuestionTypeValidator('question'),)


class QuestionSerializer(serializers.ModelSerializer):
    """
    Сериализатор Question
    """

    answers = AnswerSerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = models.Question
        fields = ("id",
                  "text",
                  "image",
                  "test_block",
                  "type_question",
                  "answers"
                  )

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
        fields = ("id", "text", "image", "type_question", "test_block")
        read_only_fields = ("id",)


class ContentAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContentAttachment
        fields = ["id", "file", "file_type"]


class AssessmentSubmissionSerializer(serializers.ModelSerializer):
    """
    Сериализатор представления оценок
    """
    files = ContentAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = models.AssessmentSubmission
        fields = ("teacher",
                  "test_block",
                  "student",
                  "score",
                  "comment",
                  "type_of",
                  "files",
                  "date_assessment",
                  )
        validators = (
            validators.TaskEssayQuestionValidator(),
            validators.NoAnswerForTaskEssayValidator('answer'),
        )


class StepSerializer(serializers.ModelSerializer):
    """
    Шаги - оптимизированный
    """

    attachments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Step
        fields = ("serial",
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
        fields = ("serial",
                  "title",
                  "content_text",
                  "lesson",
                  )
        validators = (validators.MoreThanZeroValidator("serial"),)

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


class StepViewSerializer(serializers.ModelSerializer):
    """
    Шаг детальный
    """

    attachments = ContentAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = models.Step
        fields = ("serial",
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
            "name",
            "serial",
            "course",
        )
        read_only_fields = ("id",)
        validators = (validators.LessonScormValidator('course'),)


class LessonSerializer(serializers.ModelSerializer):
    """
    Сериализатор оптимизированного вывода
    """
    steps = StepSerializer(many=True)
    test_block = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "name",
            "serial",
            "course",
            "steps",
            "test_block",
        )


class LessonViewSerializer(serializers.ModelSerializer):
    """
    Сериализатор детального представления урока
    """
    steps = StepViewSerializer(many=True)
    test_block = TestBlockSerializersDetail()

    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "name",
            "serial",
            "course",
            "steps",
            "test_block",
        )


class SCORMSerializer(serializers.ModelSerializer):
    """
    Сериализатор SCORM пакета
    """

    class Meta:
        model = models.SCORM
        fields = ('id', 'name', 'version', 'resourse')


class ZIPFileField(serializers.FileField):

    def to_internal_value(self, data):
        self.error_messages.update(non_zip='File need to be zip format')
        try:
            file_name = data.name
            file_size = data.size
        except AttributeError:
            self.fail('invalid')
        if not re.match(r'\S*.zip', file_name):
            self.fail('non_zip')

        if not file_name:
            self.fail('no_name')
        if not self.allow_empty_file and not file_size:
            self.fail('empty')
        if self.max_length and len(file_name) > self.max_length:
            self.fail('max_length', max_length=self.max_length,
                      length=len(file_name))

        return data


class CreateCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор на обработку создания и обновления курсов
    """

    scorm = ZIPFileField(required=False)
    scorms = serializers.PrimaryKeyRelatedField(read_only=True, required=False, many=True)

    class Meta:
        model = models.Course
        fields = (
            "name",
            "description",
            "beginer",
            "image",
            "profession",
            "scorm",
            "scorms",
            "experiences",
        )
        validators = (validators.CourseScormValidator('scorm'),)

    def create(self, validated_data: dict):
        logger.debug(validated_data)
        zip_scorm = validated_data.pop('scorm', None)
        if zip_scorm:
            try:
                with atomic():
                    course = SCORMLoader(zip_archive=zip_scorm).save(
                        self.Meta.model,
                        validated_data,
                        )
            except IntegrityError as er:
                raise ValidationError(dict(scorm=f'This SCORM packpage {parse_exeption_error(er)}'))
            except (SCORMExtractError, ManifestNotSetupError) as er:
                raise ValidationError(dict(scorm=er))
        else:
            course = super().create(validated_data)
        return course


class CourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор Оптимизированого вывода
    """
    lessons = LessonSerializer(many=True)
    scorms = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Course
        fields = (
            "id",
            "name",
            "description",
            "beginer",
            "create_date",
            "update_date",
            "image",
            "profession",
            "scorms",
            "experiences",
            "lessons",
        )


class ViewCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор вывода детального курса
    """

    experiences = user_serializers.WorkExperienceSerializer(many=True)
    profession = user_serializers.ProfessionSerializer()
    lessons = LessonViewSerializer(many=True)
    scorms = SCORMSerializer(many=True)

    class Meta:
        model = models.Course
        fields = (
            "id",
            "name",
            "description",
            "beginer",
            "create_date",
            "update_date",
            "image",
            "profession",
            "experiences",
            "scorms",
            "lessons",
        )


class EventViewSerializer(serializers.ModelSerializer):
    """
    Сериализатор Эвента
    """

    course = ViewCourseSerializer()

    class Meta:
        model = models.Event
        fields = (
            "id",
            "user",
            "course",
            "done_lessons",
            "start_date",
            "end_date",
            "favorite",
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
            "user",
            "course",
            "done_lessons",
            "start_date",
            "end_date",
            "favorite",
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
            "user",
            "course",
            "start_date",
            "end_date",
            "favorite",
            "status",
        )
        validators = (validators.TimeValidator("start_date", "end_date"),)

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

    # def _create_lesson_stories(self, user, course):
    #     """
    #     Создает LessonStory для всех free-уроков и урока с serial=1
    #     """
    #     try:
    #         lesson_ids = set(
    #             models.Lesson.objects.filter(
    #                 Q(course=course) & (Q(type_lesson="free") | Q(serial=1))
    #             ).values_list('id', flat=True)
    #         )
    #
    #         logger.debug(
    #             f'Нашлось {len(lesson_ids)} открытых на данный момент'
    #             f' уроков в курсе {course.id}')
    #
    #         if lesson_ids:
    #             models.LessonStory.objects.bulk_create([
    #                 models.LessonStory(user=user, lesson_id=lesson_id,
    #                                    course=course)
    #                 for lesson_id in lesson_ids
    #             ], ignore_conflicts=True)
    #
    #             logger.success(
    #                 f'Создано {len(lesson_ids)} открытых уроков  в LessonStory')
    #
    #     except Exception as e:
    #         logger.error(f"Ошибка создания LessonStory: {str(e)}")
    #         raise
    #
    # def create(self, validated_data):
    #     event = super().create(validated_data)
    #     self._create_lesson_stories(
    #         user=validated_data["user"],
    #         course=validated_data["course"]
    #     )
    #     return event

    def save(self, **kwargs):
        logger.debug(f"before {self.validated_data}")
        self._correct_status(self.validated_data)
        logger.debug(f"after {self.validated_data}")
        return super().save(**kwargs)


class EventSerializerUpdate(serializers.ModelSerializer):
    """
    Сериализатор Создания в Изменения Эвента
    """

    status = serializers.CharField(read_only=True)

    class Meta:
        model = models.Event
        fields = (
            "user",
            "course",
            "start_date",
            "end_date",
            "favorite",
            "status",
        )
        validators = (validators.TimeValidator("start_date", "end_date"),)
        read_only_fields = ("id", "start_date", "course", "user")
