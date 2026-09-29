@echo off
title OScopeX Launcher
echo ========================================================
echo   Launching OScopeX Platform (Full-Stack)
echo   Backend  : http://localhost:8001
echo   Frontend : http://localhost:5174
echo ========================================================
start "OScopeX Backend (Port 8001)" cmd /c "%~dp0start-backend.bat"
timeout /t 2 /nobreak >nul
start "OScopeX Frontend (Port 5174)" cmd /c "%~dp0start-frontend.bat"
echo.
echo Both servers have been launched in separate windows!
echo Open your browser at: http://localhost:5174
echo.
