from typing import TYPE_CHECKING, Any

from rest_framework.serializers import ModelSerializer

if TYPE_CHECKING:
    from lessons.models import Question, Course


from datetime import datetime, timedelta, timezone
from typing import ClassVar

from loguru import logger
from pydantic import BaseModel, Field


class UTCTimeCast(BaseModel):
    """
    Построение UTC времени
    """
    is_set: ClassVar[bool] = Field(default=False)

    input_time: datetime
    UTC: int = Field(default=0, gt=-13, lt=13)

    def _handle_offset_time(self,
                            input_time: datetime,
                            UTC: int) -> datetime:
        """Изменение времени исходя из указанных настроек

        Args:
            input_time (datetime): Целевое время
            UTC (int): Желаемое UTC: -13 > UTC < 13

        Returns:
            datetime: Возвращает обработанный datetime
        """
        offset = timedelta(hours=UTC)
        utc_set = timezone(offset, name=f'UTC{UTC}')
        result_time = input_time.astimezone(utc_set)
        return result_time

    def _to_UNIX_microseconds(self, offset_time: datetime) -> int:
        """Перевод времени в UNIX микросекунды

        Args:
            offset_time (datetime): Обработаное время с UTC

        Returns:
            int: Милисекунды
        """
        timestamp = int(offset_time.timestamp() * 1000)
        microseconds = int(offset_time.microsecond / 1000)
        microseconds_result = timestamp + microseconds
        return microseconds_result

    def get_UTC_set_time(self) -> datetime:
        """
        Получение времени по желаемому UTC
        """
        output_time = self._handle_offset_time(input_time=self.input_time,
                                               UTC=self.UTC,
                                               )
        UTCTimeCast.is_set = True
        return output_time

    def get_microseconds_off_UTC_time(self) -> int:
        """
        Получение микросекунд от вычисленного времени
        """
        time_utc = self._handle_offset_time(input_time=self.input_time,
                                            UTC=self.UTC,
                                            )
        logger.info(time_utc)
        microseconds = self._to_UNIX_microseconds(offset_time=time_utc)
        logger.info(microseconds)
        return microseconds

    def __repr__(self) -> str:
        return f'{self.__class__.__name__} {self.input_time} {self.UTC}'

    def __str__(self) -> str:
        return str(self.UTC)


def path_maker_question(instance: 'Question', filename: str) -> str:
    """
    Создает корректный путь для сохранения медиа файлов
    в системе.
    """
    text_tranc = instance.text[0:10]
    return f'question/{text_tranc}/{filename}'


def path_maker_course(instance: 'Course', filename: str) -> str:
    """
    Создает корректный путь для сохранения медиа файлов
    в системе.
    """
    text_tranc = instance.name
    return f'course/{text_tranc}/{filename}'


def get_value(field: str,
              attrs: dict[str, Any],
              serializer: ModelSerializer,
              ) -> Any:
    """Функция выполняющая получение значения
    исходя из того что - пользователь желает изменить поле
    или пользователь просто не указал его
    """
    try:
        value = attrs[field]
    except KeyError:
        if serializer.instance:
            instance = serializer.instance
            field = instance._meta.get_field(field)
            value = field.value_from_object(instance)
        else:
            field = serializer.get_fields()[field]
            try:
                has_default = field.has_default()
                if has_default:
                    value = field.default
                else:
                    value = None
            except AttributeError:
                value = None
    return value


def tigger_to_check(attrs: dict[str, Any],
                    *fields: list[str],
                    ) -> bool:
    """Тригер если проверка нужна
    """
    need_check = False
    for field in fields:
        if field in attrs:
            need_check = True
    return need_check


def set_value(dict_data: dict[str, Any],
              key: str,
              value: str,
              ) -> None:
    dict_data[key] = value
