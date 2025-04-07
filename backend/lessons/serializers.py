import datetime

from rest_framework import serializers
from django.utils import timezone
from loguru import logger

from lessons import models, validators
from lessons.d_types import VD
from lessons.patrials import set_status
from users import serializers as user_serializers


PROCESS = "process"
EXPECTED = "expected"
DONE = "done"
FAILED = "failed"


class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserStory
        fields = ['id', 'user', 'answer', 'test_block', 'date_opened']
        read_only_fields = ['id', 'user', 'date_opened']

    def validate(self, data):
        validators.UserStoryValidator(
            answer=data.get('answer'),
            test_block=data.get('test_block')
        )()
        return data


class LessonStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LessonStory
        fields = ['course', 'lesson', 'user', 'date_opened']
        read_only_fields = ['user', 'date_opened']

    def validate(self, data):
        validators.LessonStoryValidator(
            course=data.get('course'),
            lesson=data.get('lesson')
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
        fields = ("id", "text", "image", "answers")

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
        fields = ("id", "text", "image", "test_block")
        read_only_fields = ("id",)


class ContentAttachmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ContentAttachment
        fields = ["id", "file", "file_type"]


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


class LessonSerializer(serializers.ModelSerializer):
    """
    Сериализатор оптимизированного вывода
    """
    steps = StepSerializer(many=True)
    test_block = serializers.PrimaryKeyRelatedField(read_only=True)
    lesson_story = LessonStorySerializer()

    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "name",
            "serial",
            "course",
            "steps",
            "test_block",
            "lesson_story",
        )


class LessonViewSerializer(serializers.ModelSerializer):
    """
    Сериализатор детального представления урока
    """
    steps = StepViewSerializer(many=True)
    test_block = TestBlockSerializersDetail()
    lesson_story = serializers.SerializerMethodField()

    class Meta:
        model = models.Lesson
        fields = (
            "id",
            "name",
            "serial",
            "course",
            "steps",
            "test_block",
            "lesson_story",
        )

    def get_lesson_story(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            lesson_story = models.LessonStory.objects.filter(
                user=request.user,
                lesson=obj
            ).first()
            if lesson_story:
                return LessonStorySerializer(lesson_story).data
        return None


class CreateCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор на обработку создания и обновления курсов
    """

    scorms = serializers.ListField(child=serializers.FileField(),
                                   required=False,
                                   )

    class Meta:
        model = models.Course
        fields = (
            "name",
            "description",
            "beginer",
            "image",
            "profession",
            "scorms",
            "experiences",
        )

    def to_internal_value(self, data):
        data['scorms'] = (data['scorms'].split(',')
                          if data['scorms']
                          else [])
        return data

    def create(self, validated_data):
        return super().create(validated_data)


class CourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор Оптимизированого вывода
    """
    lessons = LessonSerializer(many=True)

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
            "lessons",
        )


class ViewCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор вывода детального курса
    """

    experiences = user_serializers.WorkExperienceSerializer(many=True)
    profession = user_serializers.ProfessionSerializer()
    lessons = LessonViewSerializer(many=True)
    lesson_story = LessonStorySerializer(many=True)

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
            "lessons",
            "lesson_story",
        )


class EventViewSerializer(serializers.ModelSerializer):
    """
    Сериализатор Эвента
    """

    course = ViewCourseSerializer()
    lesson_story = serializers.SerializerMethodField()

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
            "lesson_story",
        )

    def get_lesson_story(self, obj):
        stories = models.LessonStory.objects.filter(
            user=obj.user,
            course=obj.course
        ).select_related('lesson')

        return LessonStorySerializer(stories, many=True).data


class EventSerializer(serializers.ModelSerializer):
    """
    Сериализатор Эвента
    """

    course = CourseSerializer()
    lesson_story = serializers.SerializerMethodField()

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
            "lesson_story",
        )

    def get_lesson_story(self, obj):
        return list(
            models.LessonStory.objects.filter(
                user=obj.user,
                course=obj.course
            ).values_list('lesson_id', flat=True)
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
