FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV POETRY_V=1.8.3
ENV POETRY_VIRTUALENVS_CREATE=false
ENV PYTHONPATH=/app

RUN adduser user \
    && addgroup docker \
    && adduser user docker

RUN pip install poetry

COPY ./backend/pyproject.toml ./

RUN poetry install --no-root
RUN apt-get update \
    && apt-get install -y postgresql \
    && apt-get install -y postgresql-client \
    && apt-get install -y build-essential \
    && apt-get install -y libpq-dev \
    && apt-get install -y gettext \
    && apt-get install -y git \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*


COPY ./backend/docker/django/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY ./backend/docker/django/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

WORKDIR /app

RUN chown -R user:user .

#USER user

EXPOSE 8080

ENTRYPOINT [ "/entrypoint" ]
