# Script PowerShell para executar o sistema completo

Write-Host "🚀 Iniciando Dose da Braba..." -ForegroundColor Green

# Configurar variável de ambiente
$env:DATABASE_URL = "host=localhost user=postgres password=123 dbname=dose_da_braba port=5432 sslmode=disable"

# Verificar se o PostgreSQL está rodando na porta 5432
Write-Host "📊 Verificando PostgreSQL..." -ForegroundColor Yellow
$pgRunning = $false
try {
    $connection = New-Object System.Net.Sockets.TcpClient("localhost", 5432)
    $connection.Close()
    $pgRunning = $true
    Write-Host "✅ PostgreSQL está rodando" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostgreSQL não está rodando. Iniciando com Docker..." -ForegroundColor Yellow
    Set-Location back
    docker-compose up -d
    Start-Sleep 5
    Set-Location ..
}

Write-Host "🔧 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location back
go mod tidy

Write-Host "🔧 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location ..\front\front-end
npm install

# Executar backend em background
Write-Host "🚀 Iniciando backend..." -ForegroundColor Green
Set-Location ..\..\back
$backendJob = Start-Job -ScriptBlock { 
    Set-Location $using:PWD\back
    $env:DATABASE_URL = $using:env:DATABASE_URL
    go run cmd/api/main.go 
}

# Aguardar backend inicializar
Start-Sleep 3

# Executar frontend
Write-Host "🚀 Iniciando frontend..." -ForegroundColor Green
Set-Location ..\front\front-end
$frontendJob = Start-Job -ScriptBlock { 
    Set-Location $using:PWD\front\front-end
    npm run dev 
}

Write-Host "✅ Sistema iniciado!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o sistema" -ForegroundColor Yellow

# Aguardar e monitorar jobs
try {
    while ($backendJob.State -eq "Running" -and $frontendJob.State -eq "Running") {
        Start-Sleep 1
        
        # Mostrar output dos jobs
        $backendJob | Receive-Job -Keep | ForEach-Object { Write-Host "[BACKEND] $_" -ForegroundColor Blue }
        $frontendJob | Receive-Job -Keep | ForEach-Object { Write-Host "[FRONTEND] $_" -ForegroundColor Magenta }
    }
} finally {
    Write-Host "🛑 Parando sistema..." -ForegroundColor Red
    Stop-Job $backendJob -Force
    Stop-Job $frontendJob -Force
    Remove-Job $backendJob -Force
    Remove-Job $frontendJob -Force
}
