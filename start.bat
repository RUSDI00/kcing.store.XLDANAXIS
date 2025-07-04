@echo off
echo ========================================
echo    KCING.STORE - Sistem Pembayaran QRIS
echo ========================================
echo.
echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm start"
echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend React App...
cd ..
start "Frontend App" cmd /k "npm start"
echo.
echo ========================================
echo    SERVERS STARTED!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Admin Login:
echo Username: admin
echo Password: admin123
echo.
echo Admin Dashboard: http://localhost:3000/admin
echo.
echo ========================================
pause
