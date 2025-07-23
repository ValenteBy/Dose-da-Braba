package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ValenteBy/Dose-da-Braba/internal/application"
	"github.com/ValenteBy/Dose-da-Braba/internal/domain"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/dao"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/model"
)

func main() {
    // Conectar ao PostgreSQL
    dsn := "host=localhost user=postgres password=123 dbname=dose_da_braba port=5432 sslmode=disable"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Erro ao conectar com o banco:", err)
    }

    db.AutoMigrate(&model.ClienteModel{})

    orderRepo := dao.NewOrderPostgres(db)
    productRepo := dao.NewProductPostgres(db)
    clienteRepo := dao.NewClientePostgres(db)
    pedidoBO := application.PedidoBO{OrderRepo: orderRepo}
    pagamentoBO := application.PagamentoBO{OrderRepo: orderRepo}
    clienteBO := application.ClienteBO{ClienteRepo: clienteRepo}
    app := fiber.New()

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
    app.Get("/api/orders/:id", func(c *fiber.Ctx) error {
        id := c.Params("id")
        order, err := orderRepo.FindByID(id)
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "pedido não encontrado"})
        }
        return c.JSON(fiber.Map{
            "order_id": order.ID,
            "status":   order.Status,
            "total":    order.TotalPrice,
        })
    })

    // Listar menu
    app.Get("/api/menu", func(c *fiber.Ctx) error {
        products, err := productRepo.FindAll()
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "erro ao buscar menu"})
        }
        return c.JSON(products)
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
        return c.JSON(orders)
    })

    // Notificações do cliente
    app.Get("/api/customers/:cpf/notifications", func(c *fiber.Ctx) error {
        cpf := c.Params("cpf")
        notifs := domain.GetClienteNotifications(cpf)
        return c.JSON(fiber.Map{"notifications": notifs})
    })

    // Pagamento do pedido com desconto
    app.Post("/api/orders/:id/pay", func(c *fiber.Ctx) error {
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

    log.Fatal(app.Listen(":3000"))
}