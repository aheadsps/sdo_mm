from functools import partial

from lessons.utils import set_value

set_status = partial(
    set_value,
    key="status",
)
