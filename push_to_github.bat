@echo off
title NOHADAYA STUDIO - Auto GitHub Pusher
echo ============================================================
echo   NOHADAYA STUDIO - 1-CLICK AUTO GITHUB PUSH ^& DEPLOY
echo ============================================================
echo.

cd /d "%~dp0"

python auto_push.py

echo.
echo ============================================================
echo   Website: https://www.nohadaya.com
echo ============================================================
echo.
pause
