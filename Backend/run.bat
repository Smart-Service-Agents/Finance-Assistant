@echo off

cd /d "%~dp0"

start "" cmd /k "echo Wait for the Python server to start. && python manage.py runserver"