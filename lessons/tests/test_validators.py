import pytest
from typing import Dict
from lessons.validators import UserStoryValidator

class TestUserStoryValidator:
    def setup_method(self):
        self.validator = UserStoryValidator(lesson="lesson",
                                            question="question",
                                            answer="answer",
                                            step="step")

    def test_valid_lesson_only(self):
        attrs: Dict = {"lesson": "Some Lesson"}
        result = self.validator(attrs)
        assert result is None

    def test_invalid_types(self):
        with pytest.raises(TypeError):
            UserStoryValidator(1,"question", "answer", "step")

