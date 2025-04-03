from config.celery import app

@app.task(serializer='json')
def create_events(course_id, x) -> None:

    """
    создавать events
    в любом количестве по списку пользователей
    """
    #course_id: int, user_id: list, start_date, end_date
    # course_id: int = None, user_id: list = None, start_date = None, end_date = None
    print("****************")
