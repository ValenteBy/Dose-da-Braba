package application

import (
	"github.com/ValenteBy/Dose-da-Braba/internal/domain"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/dao"
)

type PedidoBO struct {
    OrderRepo *dao.OrderPostgres
}

func (bo *PedidoBO) CriarPedido(dto PlaceOrderDTO) (*domain.Order, error) {
    var bebidas []domain.Beverage
    for _, item := range dto.Items {
        b := domain.NewBeverage(item.Base)
        b = domain.ApplyAddons(b, item.Addons)
        bebidas = append(bebidas, b)
    }
    order := domain.NewOrder(bebidas)
    order.CPF = dto.CPF
    order.Attach(domain.ConsoleObserver{Name: "Cozinha"})
    order.Attach(domain.ClienteObserver{CPF: dto.CPF})
    if err := bo.OrderRepo.Save(order); err != nil {
        return nil, err
    }
    return order, nil
}

func (bo *PedidoBO) CancelarPedido(id string) (*domain.Order, error) {
    order, err := bo.OrderRepo.FindByID(id)
    if err != nil {
        return nil, err
    }
    if err := order.Cancel(); err != nil {
        return nil, err
    }
    if err := bo.OrderRepo.Save(order); err != nil {
        return nil, err
    }
    return order, nil
}

func (bo *PedidoBO) AvancarStatus(id string) (*domain.Order, error) {
    order, err := bo.OrderRepo.FindByID(id)
    if err != nil {
        return nil, err
    }
    order.NextStatus()
    order.Notify()
    if err := bo.OrderRepo.Save(order); err != nil { // <-- Salva o pedido atualizado
        return nil, err
    }
    return order, nil
}
// Adicionar no application/PagamentoBO para separar
