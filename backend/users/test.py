import math

from datetime import datetime, date


now = datetime.now()
date_now = date(year=now.year, month=now.month, day=now.day)
experience = date(year=2000, month=4, day=19)

print(math.floor((date_now - experience).days / 365))
