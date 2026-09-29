@echo off
title OScopeX — Backend Server
cd /d "%~dp0backend"
echo ========================================================
echo Starting OScopeX Backend (FastAPI) on port 8001...
echo API Health: http://localhost:8001/api/health
echo Swagger Docs: http://localhost:8001/docs
echo ========================================================
.\venv\Scripts\python run.py
pause
