@echo off

echo AI-IDT Starting up
echo.

echo Activating API
call :start_API

echo Activating Frontend
call :start_frontend

echo All services active
exit /b

:start_API
    start "API" /d "%~dp0core" /b cmd /k ".venv\Scripts\python.exe -m uvicorn api:app --reload"
    exit /b


:start_frontend
    start "Frontend" /d "%~dp0frontend" /b cmd /c "npm run dev"
    exit /b