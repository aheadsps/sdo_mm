#!/bin/bash


poetry install
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata admin.json
python manage.py runserver
