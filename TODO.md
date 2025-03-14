# Install

## Нужно заполнить файл .env всеми неоходимыми данными:

```python
DB_PASSWORD=password # Пароль Базы данных (использование).
POSTGRES_PASSWORD=password # Пароль Базы данных (настройка).
```

## Необходимо ввести команды:

Проект находится под контролем системы контеризации Docker.

```bash
docker-compose build
```

```bash
docker-compose up
```

- По адрессу localhost:8080 Backend
- По адрессу localhost:5000 Frontend
