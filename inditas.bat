@echo off
cd /d "%~dp0server"
rem a bongeszo a szerver indulasa utan a http://localhost:8080 cimen nyilik meg
rem (WARDRO_NO_BROWSER=1 eseten nem, pl. ha csak ujrainditjuk a szervert)
if not "%WARDRO_NO_BROWSER%"=="1" start "" /min cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:8080"
node index.js
pause
