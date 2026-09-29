@echo off
title OScopeX — Frontend Server
cd /d "%~dp0frontend"
echo ========================================================
echo Starting OScopeX Frontend (Vite) on port 5174...
echo URL: http://localhost:5174
echo ========================================================
npm run dev
pause
