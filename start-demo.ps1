# AptosFlow Demo Quick Start
# This script helps you quickly start the demo

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║           🎬 AptosFlow Live Demo Quick Start 🎬              ║" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose your demo mode:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🎨 Visual Dashboard (Best for presentations)" -ForegroundColor Green
Write-Host "   - Beautiful animated UI" -ForegroundColor Gray
Write-Host "   - Click-to-trigger simulation" -ForegroundColor Gray
Write-Host "   - Live logs and statistics" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 💻 Terminal Simulator (Quick demo)" -ForegroundColor Green
Write-Host "   - Automated execution flow" -ForegroundColor Gray
Write-Host "   - Detailed console output" -ForegroundColor Gray
Write-Host "   - Shows actual transaction steps" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🚀 Real Blockchain Execution (Ultimate proof)" -ForegroundColor Green
Write-Host "   - Actual on-chain transactions" -ForegroundColor Gray
Write-Host "   - Live webhook detection" -ForegroundColor Gray
Write-Host "   - 100% real autonomous execution" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 📊 All Components (Full demo setup)" -ForegroundColor Green
Write-Host "   - Dashboard + Execution Engine" -ForegroundColor Gray
Write-Host "   - Ready for live demonstration" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🎨 Starting Visual Dashboard..." -ForegroundColor Cyan
        Write-Host "Opening browser at http://localhost:8080" -ForegroundColor Gray
        Write-Host ""
        node demo-server.js
    }
    "2" {
        Write-Host ""
        Write-Host "💻 Starting Terminal Simulator..." -ForegroundColor Cyan
        Write-Host "Watch the automated demo execution!" -ForegroundColor Gray
        Write-Host ""
        node demo-simulator.js
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Starting Real Execution Engine..." -ForegroundColor Cyan
        Write-Host "Server will listen on port 3001" -ForegroundColor Gray
        Write-Host ""
        Write-Host "To trigger execution:" -ForegroundColor Yellow
        Write-Host "  Send exactly 0.012345 APT to any address" -ForegroundColor White
        Write-Host ""
        node index.js
    }
    "4" {
        Write-Host ""
        Write-Host "📊 Starting All Components..." -ForegroundColor Cyan
        Write-Host ""
        
        # Start dashboard in background
        Write-Host "✅ Starting dashboard server on port 8080..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "node demo-server.js"
        Start-Sleep 2
        
        # Start execution engine in background
        Write-Host "✅ Starting execution engine on port 3001..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "node index.js"
        Start-Sleep 2
        
        # Open browser
        Write-Host "✅ Opening dashboard in browser..." -ForegroundColor Green
        Start-Process "http://localhost:8080"
        
        Write-Host ""
        Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║                    🎉 DEMO READY! 🎉                         ║" -ForegroundColor Green
        Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Dashboard: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "⚡ Execution Engine: Running on port 3001" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🎯 To trigger workflow:" -ForegroundColor Yellow
        Write-Host "   • Click 'Send Magic Trigger' in dashboard (simulation)" -ForegroundColor White
        Write-Host "   • OR send 0.012345 APT on real blockchain" -ForegroundColor White
        Write-Host ""
        Write-Host "Press any key to stop all components..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        
        # Cleanup
        Write-Host ""
        Write-Host "Stopping all components..." -ForegroundColor Yellow
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Write-Host "✅ All components stopped" -ForegroundColor Green
    }
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
