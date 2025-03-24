from functools import partial

from backend.lessons.utils import set_value

set_status = partial(
    set_value,
    key="status",
)
