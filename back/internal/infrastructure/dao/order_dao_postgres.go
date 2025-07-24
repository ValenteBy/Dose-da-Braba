package dao

import (
	"encoding/json"

	"github.com/ValenteBy/Dose-da-Braba/internal/domain"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/model"
	"gorm.io/gorm"
)

type OrderPostgres struct {
	db *gorm.DB
}

func NewOrderPostgres(db *gorm.DB) *OrderPostgres {
	return &OrderPostgres{db: db}
}

func (r *OrderPostgres) Save(order *domain.Order) error {
    var itemsToPersist []model.ItemPersist
    for _, b := range order.Items {
        itemsToPersist = append(itemsToPersist, model.ItemPersist{
            Base:   b.Base(),
            Addons: b.Addons(),
        })
    }
    itemsStr, _ := json.Marshal(itemsToPersist)
    modelOrder := model.OrderModel{
        ID:     order.ID,
        CPF:    order.CPF,
        Items:  string(itemsStr),
        Total:  order.TotalPrice,
        Status: order.Status,
    }
    return r.db.Save(&modelOrder).Error
}

func (r *OrderPostgres) FindByID(id string) (*domain.Order, error) {
    // Adicione este log para depuração
    println("DEBUG: Procurando pedido com ID:", id)
    var modelOrder model.OrderModel
    if err := r.db.First(&modelOrder, "id = ?", id).Error; err != nil {
        println("DEBUG: Erro ao buscar pedido:", err.Error())
        return nil, err
    }

    var itemsFromDB []model.ItemPersist
    json.Unmarshal([]byte(modelOrder.Items), &itemsFromDB)

    var bebidas []domain.Beverage
    for _, item := range itemsFromDB {
        b := domain.NewBeverage(item.Base)
        b = domain.ApplyAddons(b, item.Addons)
        bebidas = append(bebidas, b)
    }

    order := &domain.Order{
        ID:         modelOrder.ID,
        CPF:        modelOrder.CPF,
        Items:      bebidas,
        Status:     modelOrder.Status,
        TotalPrice: modelOrder.Total,
    }
    order.SetState(domain.StateFromStatus(modelOrder.Status))
    order.Attach(domain.ClienteObserver{CPF: order.CPF})
    return order, nil
}

func (r *OrderPostgres) FindByCPF(cpf string) ([]*domain.Order, error) {
    var models []model.OrderModel
    if err := r.db.Where("cpf = ?", cpf).Find(&models).Error; err != nil {
        return nil, err
    }
    var orders []*domain.Order
    for _, m := range models {
        var itemsFromDB []model.ItemPersist
        json.Unmarshal([]byte(m.Items), &itemsFromDB)

        var bebidas []domain.Beverage
        for _, item := range itemsFromDB {
            b := domain.NewBeverage(item.Base)
            b = domain.ApplyAddons(b, item.Addons)
            bebidas = append(bebidas, b)
        }

        order := &domain.Order{
            ID:         m.ID,
            CPF:        m.CPF,
            Items:      bebidas,
            Status:     m.Status,
            TotalPrice: m.Total,
        }
        order.SetState(domain.StateFromStatus(m.Status))
        order.Attach(domain.ClienteObserver{CPF: order.CPF})
        orders = append(orders, order)
    }
    return orders, nil
}

