import json

from rest_framework import serializers
from lessons import exceptions
from lessons import models, validators
from users import serializers as user_serializers
from lessons.taskmanager import TaskManager


PROCESS = "process"
EXPECTED = "expected"
DONE = "done"
FAILED = "failed"


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
    # user_story = UserStorySerialuzer(many=True)

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


class CreateCourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор на обработку создания и обновления курсов
    """

    class Meta:
        model = models.Course
        fields = (
            "name",
            "description",
            "beginer",
            "image",
            "profession",
            "experiences",
        )


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
    # lesson_story = LessonStorySerializer(many=True)

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
            # "lesson_story",
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
    users = serializers.ListField(allow_empty=False, child=serializers.IntegerField())
    status = serializers.CharField(read_only=True)

    def to_internal_value(self, data):
        """if not data['users']:
            raise exceptions.UnprocessableEntityError(
                dict(serial="Нет 'users'")
            )"""
        """if type(data['users']) is not str:
            raise exceptions.UnprocessableEntityError(
                dict(serial="'users' не str")
            )"""
        #data = json.load(data)
        print(data, "-********************************",type(data))
        data['users'] = (data['users'].split(',')
                         if data['users']
                         else [])
        return data

    class Meta:
        model = models.Event
        fields = (
            "users",
            "course",
            "start_date",
            "end_date",
            "status",
        )
        validators = (validators.TimeValidator("start_date", "end_date"),
                      validators.BadDataEventValidator("course", "users"),)

    def create(self, validated_data):
        task_manager = TaskManager(
            course=validated_data['course'],
            user_list=validated_data['users'],
            data_start=validated_data.get('start_date'),
            data_end=validated_data.get('end_date'),
        )
        instance = task_manager.create()
        return instance
