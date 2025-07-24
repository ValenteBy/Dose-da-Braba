package application

import (
	"github.com/ValenteBy/Dose-da-Braba/internal/domain"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/dao"
)

type PagamentoBO struct {
    OrderRepo *dao.OrderPostgres
}

func (bo *PagamentoBO) IsEligibleForFidelity(cpf string) (bool, error) {
    orders, err := bo.OrderRepo.FindByCPF(cpf)
    if err != nil {
        return false, err
    }
    return len(orders) >= 10, nil
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
    
    // Desconto fidelidade: só para clientes com 10+ pedidos usando dinheiro/fidelidade
    if len(orders) >= 10 && (dto.PaymentMethod == "FIDELIDADE" || dto.PaymentMethod == "dinheiro") {
        strategy = domain.FidelityCardDiscount{}
    } else if dto.PaymentMethod == "PIX" || dto.PaymentMethod == "pix" {
        strategy = domain.PixDiscount{}
    } else {
        strategy = domain.NoDiscount{}
    }
    totalFinal := strategy.Apply(order.TotalPrice)
    
    // IMPORTANTE: Atualizar o TotalPrice do pedido no banco com o valor final (com desconto)
    originalPrice := order.TotalPrice
    order.TotalPrice = totalFinal
    if err := bo.OrderRepo.Save(order); err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "order_id":      order.ID,
        "total_original": originalPrice,
        "total_final":   totalFinal,
        "desconto":      strategy.Name(),
    }, nil
}