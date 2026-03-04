@echo off
TITLE BlazeFire Arena - Frontend Start
CD /D "%~dp0"
echo Starting Frontend installation logic manually via unconstrained prompt...
pwsh -ExecutionPolicy ByPass -Command "& { npm install }" || powershell -ExecutionPolicy ByPass -Command "& { npm install }"
echo Now starting the frontend application development server via localhost process...
pwsh -ExecutionPolicy ByPass -Command "& { npm run dev }" || powershell -ExecutionPolicy ByPass -Command "& { npm run dev }"
pause
