# Install

## Enviroments

Необходимо заполнить **.env.sample** и в последствии перемеиновать его в **.env**

```python
# .env.sample
POSTGRES_PASSWORD=password # Пароль от базы данных (Настройка)
DB_PASSWORD=password # Пароль от базы данных (Использование)
```

## Docker

Проект находится под системой управления и контеризации - **Docker**.
Если у вас нет Docker - вы можете установить его с официального сайта: [Docker](https://www.docker.com/get-started/)

Необходимо ввести команды:

```bash
docker-compose build
```

```bash
docker-compose up
```

- По адрессу localhost:8080 Backend
- По адрессу localhost:5173 Frontend

Для тестирования нужно перейти во внутрь контейнера.

- Найдите контейнер:

```bash
docker ps
```

Ищите контейнер с именем у которого есть django и позьмите первые 3 символа CONTAITER ID

- Войдите в контейнер:

```bash
docker exec -it YourCONTAINERID bash
```

После этого вы попадате во внутрь контейнера где находится ваше приложение Джанго
и можете стандартно запускать тесты внутри контейнера

```bash
python manage.py test
```

### Admin

email: <admin@admin.com>

password: adminpassword

### User

email: <y@mail.ru>

password: 12345678


email: <some@yandex.ru>

password: someuser
