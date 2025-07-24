#!/bin/bash

# Script para executar o sistema completo

echo "🚀 Iniciando Dose da Braba..."

# Verificar se o PostgreSQL está rodando
echo "📊 Verificando PostgreSQL..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL não está rodando. Iniciando com Docker..."
    cd back && docker-compose up -d
    sleep 5
    cd ..
fi

# Configurar variável de ambiente
export DATABASE_URL="host=localhost user=postgres password=123 dbname=dose_da_braba port=5432 sslmode=disable"

echo "🔧 Instalando dependências do backend..."
cd back && go mod tidy

echo "🔧 Instalando dependências do frontend..."
cd ../front/front-end && npm install

# Executar backend em background
echo "🚀 Iniciando backend..."
cd ../../back
go run cmd/api/main.go &
BACKEND_PID=$!

# Aguardar backend inicializar
sleep 3

# Executar frontend
echo "🚀 Iniciando frontend..."
cd ../front/front-end
npm run dev &
FRONTEND_PID=$!

echo "✅ Sistema iniciado!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080"
echo ""
echo "Pressione Ctrl+C para parar o sistema"

# Função para limpar processos ao sair
cleanup() {
    echo "🛑 Parando sistema..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Aguardar indefinidamente
wait
