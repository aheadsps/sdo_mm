# Реализованные эндпоинты для Бэка

## Profile

### GET

- localhost:8080/api/v1/profile                          Просмотр профиля

## User

### GET

- localhost:8080/api/v1/logout                           Выход из системы пользователя

### POST

- localhost:8080/api/v1/login                            Аутентификация пользователя
- localhost:8080/api/v1/settings/password/change         Поменять пароль

## Event

### GET

- localhost:8080/api/v1/events/{event_id}                 Получение Эвента
- localhost:8080/api/v1/events/{event_id}/toggle-favorite Изменение статуса избранного
- localhost:8080/api/v1/events                            Получение списка Эвентов
- localhost:8080/api/v1/events/currents                   Получение списка Актуальных Эвентов

### POST

- localhost:8080/api/v1/events                            Создание Эвента

### PATCH

- localhost:8080/api/v1/events/{event_id}                 Обновление Эвента

### DELETE

- localhost:8080/api/v1/events/{event_id}                 Удаление Эвента

## Course

### GET

- localhost:8080/api/v1/events/{event_id}                 Получение курса
- localhost:8080/api/v1/events                            Получение списка курсов

### POST

- localhost:8080/api/v1/events                            Создание курса

### PATCH

- localhost:8080/api/v1/events/{event_id}                 Изменение курса

### DELETE

- localhost:8080/api/v1/events/{event_id}                 Удаление курса
