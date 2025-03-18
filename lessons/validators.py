from typing import Any, Dict
from rest_framework.validators import ValidationError
#from rest_framework import serializers
#from lessons.models import Answer, Question
from django.core.exceptions import ValidationError


class UserStoryValidator:
    requires_context = True


def __init__(self, filed, lesson: str, question: str, answer: str, step: str) -> None:
    if not all(isinstance(filed, str) for field in (lesson, question, answer, step)):
        raise TypeError("Аргументы должны быть именами полей (str)")

    self.lesson = lesson
    self.question = question
    self.answer = answer
    self.step = step

def _check_valid_structure(self, attrs: Dict) -> None:
    has_lesson = self.lesson in attrs
    has_group = all(field in attrs for field in (self.question, self.answer, self.step))

    if not(has_lesson or has_group):
        raise ValidationError({"detail": "Необходимо передать либо 'lesson' либо группу 'question', 'answer', 'step'"})

def __call__(self, attrs) -> Any:
    self._heck_valid_structure(attrs)


#class UserStorySerializer(serializers.Serializer):
#   question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all(),required=False)
#    answer = serializers.PrimaryKeyRelatedField(queryset=Answer.object.all(),required=False)



#def __init__(self, *args, **kwargs):
#    super().__init__(*args, **kwargs)
#    self.validators.append(
#        UserStoryValidator(
#          self.fields['lesson'].source or 'lesson',
#          self.fields['question'].source or 'question',
#          self.fields['answer'].source or 'answer',
#           self.fields['step'].source or 'step'))