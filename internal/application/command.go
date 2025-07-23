package application

import (
	"github.com/ValenteBy/Dose-da-Braba/internal/domain"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/dao"
)

type Command interface {
    Execute() (*domain.Order, error)
}
// Criar pedido
type CriarPedidoCommand struct {
    DTO       PlaceOrderDTO
    OrderRepo *dao.OrderPostgres
}

func (c *CriarPedidoCommand) Execute() (*domain.Order, error) {
    var bebidas []domain.Beverage

    for _, item := range c.DTO.Items {
        b := domain.NewBeverage(item.Base)
        b = domain.ApplyAddons(b, item.Addons)
        bebidas = append(bebidas, b)
    }

    order := domain.NewOrder(bebidas)
    order.CPF = c.DTO.CPF
    order.Attach(domain.ConsoleObserver{Name: "Cozinha"})

    if err := c.OrderRepo.Save(order); err != nil {
        return nil, err
    }

    return order, nil
}

// Cancelar pedido
type CancelarPedidoCommand struct {
    OrderID   string
    OrderRepo *dao.OrderPostgres
}

func (c *CancelarPedidoCommand) Execute() (*domain.Order, error) {
    order, err := c.OrderRepo.FindByID(c.OrderID)
    if err != nil {
        return nil, err
    }
    if order.Status != "RECEBIDO" {
        return nil, err// Crie esse erro no domain, se quiser
    }
    if err := order.Cancel(); err != nil {
        return nil, err
    }
    if err := c.OrderRepo.Save(order); err != nil {
        return nil, err
    }
    return order, nil
}

type AvancarStatusPedidoCommand struct {
    OrderID   string
    OrderRepo *dao.OrderPostgres
}

// Avançar estado pedido
func (c *AvancarStatusPedidoCommand) Execute() (*domain.Order, error) {
    order, err := c.OrderRepo.FindByID(c.OrderID)
    if err != nil {
        return nil, err
    }
    order.NextStatus()
    if err := c.OrderRepo.Save(order); err != nil {
        return nil, err
    }
    return order, nil
}