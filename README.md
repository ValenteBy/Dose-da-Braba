# Dose da Braba - Sistema de Cafeteria

Sistema completo de gerenciamento de pedidos para cafeteria implementando diversos padrões de projeto.

## Padrões Implementados

1. **Decorator** - Para personalização de bebidas
2. **Observer** - Para notificação de status de pedidos
3. **Strategy** - Para diferentes políticas de desconto
4. **Factory Method** - Para criação de bebidas
5. **Command** - Para operações de pedidos
6. **State** - Para gerenciamento de estados do pedido
7. **DAO** - Para acesso a dados

## Estrutura do Projeto

- `back/` - Backend em Go com Fiber e PostgreSQL
- `front/front-end/` - Frontend em Next.js com TypeScript

## Configuração e Execução

### Pré-requisitos

- Go 1.21+
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Backend

1. Navegue para o diretório do backend:
```bash
cd back
```

2. Configure as variáveis de ambiente:
```bash
# Windows PowerShell
$env:DATABASE_URL = "host=localhost user=postgres password=123 dbname=dose_da_braba port=5432 sslmode=disable"

# Linux/Mac
export DATABASE_URL="host=localhost user=postgres password=123 dbname=dose_da_braba port=5432 sslmode=disable"
```

3. Instale as dependências:
```bash
go mod tidy
```

4. Execute o banco de dados PostgreSQL:
```bash
# Com Docker
docker-compose up -d

# Ou configure manualmente um PostgreSQL na porta 5432
```

5. Execute o backend:
```bash
go run cmd/api/main.go
```

O backend estará disponível em `http://localhost:8080`

### Frontend

1. Navegue para o diretório do frontend:
```bash
cd front/front-end
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o frontend:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## Funcionalidades

### Cliente
- Visualizar menu de produtos
- Personalizar bebidas com ingredientes adicionais
- Adicionar produtos ao carrinho
- Fazer pedidos com dados do cliente
- Escolher método de pagamento (PIX, Cartão, Dinheiro)
- Acompanhar status do pedido em tempo real
- Cancelar pedidos (antes do preparo)

### Sistema
- Aplicação automática de descontos baseada no método de pagamento:
  - PIX: 5% de desconto
  - Dinheiro com Cartão Fidelidade: 10% de desconto
  - Cartão de Crédito: Sem desconto
- Gerenciamento de estados do pedido: Recebido → Em Preparo → Pronto → Entregue
- Notificações automáticas para mudanças de status
- Validação de CPF
- Persistência de dados no PostgreSQL

## API Endpoints

### Produtos
- `GET /api/menu` - Lista produtos disponíveis

### Pedidos
- `POST /api/orders` - Criar novo pedido
- `GET /api/orders/:id` - Buscar pedido por ID
- `PATCH /api/orders/:id/status` - Avançar status do pedido
- `POST /api/orders/:id/cancel` - Cancelar pedido
- `POST /api/orders/:id/pay` - Processar pagamento

### Clientes
- `GET /api/customers/:cpf/orders` - Histórico de pedidos
- `GET /api/customers/:cpf/notifications` - Notificações do cliente

## Padrões de Projeto em Ação

### Decorator Pattern
Aplicado na personalização de bebidas:
```go
// Café base
cafe := NewBeverage("Cafe")

// Decorando com ingredientes
cafePersonalizado := ApplyAddons(cafe, []string{"LeiteDeAveia", "Canela", "SemAcucar"})
```

### Strategy Pattern
Aplicado nos descontos de pagamento:
```go
type DiscountStrategy interface {
    Apply(total float64) float64
    Name() string
}

// FidelityCardDiscount, PixDiscount, NoDiscount
```

### Observer Pattern
Implementado para notificações de status:
```go
// Clientes e cozinha são notificados automaticamente sobre mudanças
```

### State Pattern
Gerencia transições de estado do pedido:
```go
// RECEBIDO → EM_PREPARO → PRONTO → ENTREGUE
```

## Tecnologias Utilizadas

### Backend
- Go 1.21
- Fiber (framework web)
- GORM (ORM)
- PostgreSQL
- Docker

### Frontend
- Next.js 15
- React 19
- TypeScript
- CSS Modules

## Desenvolvimento

O projeto está configurado para desenvolvimento com hot reload tanto no frontend quanto no backend. O frontend faz proxy das requisições `/api/*` para o backend automaticamente.
