package application

import (
	"github.com/ValenteBy/Dose-da-Braba/internal/domain"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/dao"
)

type PagamentoBO struct {
    OrderRepo *dao.OrderPostgres
}

// Adicionar no application/PagamentoBO para separar
func (bo *PagamentoBO) PagarPedido(id string, dto PayDTO) (map[string]interface{}, error) {
    order, err := bo.OrderRepo.FindByID(id)
    if err != nil {
        return nil, err
    }
    orders, err := bo.OrderRepo.FindByCPF(dto.CPF)
    if err != nil {
        return nil, err
    }
    var strategy domain.DiscountStrategy
    if len(orders) >= 10 {
        strategy = domain.FidelityCardDiscount{}
    } else if dto.PaymentMethod == "pix" {
        strategy = domain.PixDiscount{}
    } else {
        strategy = domain.NoDiscount{}
    }
    totalFinal := strategy.Apply(order.TotalPrice)
    return map[string]interface{}{
        "order_id":      order.ID,
        "total_original": order.TotalPrice,
        "total_final":   totalFinal,
        "desconto":      strategy.Name(),
    }, nil
}