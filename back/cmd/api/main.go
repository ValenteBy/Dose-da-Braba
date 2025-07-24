package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ValenteBy/Dose-da-Braba/internal/application"
	"github.com/ValenteBy/Dose-da-Braba/internal/domain"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/dao"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/model"
)

func main() {
    // Conectar ao PostgreSQL
    dsn := os.Getenv("DATABASE_URL")
    if dsn == "" {
        dsn = "host=localhost user=postgres password=123 dbname=dose_da_braba port=5432 sslmode=disable"
    }
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Erro ao conectar com o banco:", err)
    }

    db.AutoMigrate(&model.ClienteModel{}, &model.OrderModel{}, &model.ProductModel{})

    // Seed produtos padrão se não existirem
    var count int64
    db.Model(&model.ProductModel{}).Count(&count)
    if count == 0 {
        defaultProducts := []model.ProductModel{
            {Name: "Café Expresso", Price: 15.99, Category: "Cafe"},
            {Name: "Cappuccino", Price: 19.99, Category: "Cafe"},
            {Name: "Latte", Price: 19.99, Category: "Cafe"},
            {Name: "Americano", Price: 12.99, Category: "Cafe"},
            {Name: "Chá Verde", Price: 10.99, Category: "Cha"},
            {Name: "Chá Preto", Price: 10.99, Category: "Cha"},
            {Name: "Chá de Camomila", Price: 12.99, Category: "Cha"},
        }
        for _, product := range defaultProducts {
            db.Create(&product)
        }
    }

    orderRepo := dao.NewOrderPostgres(db)
    productRepo := dao.NewProductPostgres(db)
    clienteRepo := dao.NewClientePostgres(db)
    pedidoBO := application.PedidoBO{OrderRepo: orderRepo}
    pagamentoBO := application.PagamentoBO{OrderRepo: orderRepo}
    clienteBO := application.ClienteBO{ClienteRepo: clienteRepo}
    app := fiber.New()
    
    // CORS configuration
    app.Use(cors.New(cors.Config{
        AllowOrigins: "http://localhost:3000,http://localhost:3001,http://localhost:3002",
        AllowHeaders: "Origin, Content-Type, Accept, Authorization",
        AllowMethods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        AllowCredentials: true,
    }))

    // Criar pedido
    app.Post("/api/orders", func(c *fiber.Ctx) error {
        var dto application.PlaceOrderDTO
        if err := c.BodyParser(&dto); err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "payload inválido"})
        }

        if !domain.IsValidCPF(dto.CPF) {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "CPF inválido"})
        }
        for _, item := range dto.Items {
            for _, addon := range item.Addons {
                if !domain.IsValidAddon(addon) {
                    return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Ingrediente inválido: " + addon})
                }
            }
        }

        // Registrar ou atualizar cliente
        _ = clienteBO.RegistrarOuAtualizarCliente(dto.CPF, "")

        order, err := pedidoBO.CriarPedido(dto)
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "erro ao salvar pedido"})
        }
        // Adiciona fidelidade ao cliente
        _ = clienteBO.AdicionarFidelidade(dto.CPF)
        return c.Status(fiber.StatusCreated).JSON(fiber.Map{
            "order_id": order.ID,
            "status":   order.Status,
            "total":    order.TotalPrice,
        })
    })

    // Buscar pedido por ID
    // No main.go, substitua o handler de GET /api/orders/:id por:
    app.Get("/api/orders/:id", func(c *fiber.Ctx) error {
        id := c.Params("id")
        order, err := orderRepo.FindByID(id)
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "pedido não encontrado"})
        }
        var items []application.OrderItemResponse
        for _, b := range order.Items {
            items = append(items, application.OrderItemResponse{
                Base:   b.Base(),
                Addons: b.Addons(),
            })
        }
        resp := application.OrderResponse{
            ID:         order.ID,
            CPF:        order.CPF,
            Items:      items,
            Status:     order.Status,
            TotalPrice: order.TotalPrice,
        }
        return c.JSON(resp)
    })

    // Listar todos os pedidos (para cozinha)
    app.Get("/api/orders", func(c *fiber.Ctx) error {
        orders, err := orderRepo.FindAll()
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "erro ao buscar pedidos"})
        }

        var resp []application.OrderResponse
        for _, o := range orders {
            var items []application.OrderItemResponse
            for _, b := range o.Items {
                items = append(items, application.OrderItemResponse{
                    Base:   b.Base(),
                    Addons: b.Addons(),
                })
            }
            resp = append(resp, application.OrderResponse{
                ID:         o.ID,
                CPF:        o.CPF,
                Items:      items,
                Status:     o.Status,
                TotalPrice: o.TotalPrice,
            })
        }
        return c.JSON(resp)
    })

    // Listar menu
    app.Get("/api/menu", func(c *fiber.Ctx) error {
        products, err := productRepo.FindAll()
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "erro ao buscar menu"})
        }
        
        // Converter para o formato esperado pelo frontend
        var menuItems []map[string]interface{}
        for _, product := range products {
            menuItems = append(menuItems, product.ToMenuItem())
        }
        
        return c.JSON(menuItems)
    })

    // Cancelar pedido
    app.Post("/api/orders/:id/cancel", func(c *fiber.Ctx) error {
        order, err := pedidoBO.CancelarPedido(c.Params("id"))
        if err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
        }
        return c.JSON(fiber.Map{
            "order_id": order.ID,
            "status":   order.Status,
        })
    })

    // Avançar status do pedido
    app.Patch("/api/orders/:id/status", func(c *fiber.Ctx) error {
        order, err := pedidoBO.AvancarStatus(c.Params("id"))
        if err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
        }
        return c.JSON(fiber.Map{
            "order_id": order.ID,
            "status":   order.Status,
        })
    })

    // Histórico de pedidos do cliente
    app.Get("/api/customers/:cpf/orders", func(c *fiber.Ctx) error {
        cpf := c.Params("cpf")
        orders, err := orderRepo.FindByCPF(cpf)
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "erro ao buscar pedidos"})
        }

        var resp []application.OrderResponse
        for _, o := range orders {
            var items []application.OrderItemResponse
            for _, b := range o.Items {
                items = append(items, application.OrderItemResponse{
                    Base:   b.Base(),
                    Addons: b.Addons(),
                })
            }
            resp = append(resp, application.OrderResponse{
                ID:         o.ID,
                CPF:        o.CPF,
                Items:      items,
                Status:     o.Status,
                TotalPrice: o.TotalPrice,
            })
        }
        return c.JSON(resp)
    })
    // Notificações do cliente
    app.Get("/api/customers/:cpf/notifications", func(c *fiber.Ctx) error {
        cpf := c.Params("cpf")
        notifs := domain.GetClienteNotifications(cpf)
        return c.JSON(fiber.Map{"notifications": notifs})
    })

    // Pagamento do pedido com desconto
    app.Post("/api/orders/:id/pay", func(c *fiber.Ctx) error {
        log.Println("Recebendo pagamento para ID:", c.Params("id"))
        var dto application.PayDTO
        if err := c.BodyParser(&dto); err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "payload inválido"})
        }

        if !domain.IsValidPaymentMethod(dto.PaymentMethod) {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Método de pagamento inválido"})
        }

        result, err := pagamentoBO.PagarPedido(c.Params("id"), dto)
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
        }
        return c.JSON(result)
    })

    log.Fatal(app.Listen(":8080"))
}