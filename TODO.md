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
