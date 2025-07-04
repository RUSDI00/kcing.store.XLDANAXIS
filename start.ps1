# KCING.STORE Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   KCING.STORE - Sistem Pembayaran QRIS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

Write-Host "Waiting 3 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting Frontend React App..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    SERVERS STARTED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Admin Login:" -ForegroundColor Magenta
Write-Host "Username: admin" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Admin Dashboard: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to continue..."
