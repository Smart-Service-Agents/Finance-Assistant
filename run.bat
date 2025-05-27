@echo off

cd /d "%~dp0/Frontend"

start "" cmd /k "npm run start"

cd /d "%~dp0/Backend"

start "" cmd /k "python manage.py runserver"