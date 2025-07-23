package dao

import (
	"encoding/json"

	"github.com/ValenteBy/Dose-da-Braba/internal/domain"
	"gorm.io/gorm"

	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/model"
)

type OrderPostgres struct {
	db *gorm.DB
}

func NewOrderPostgres(db *gorm.DB) *OrderPostgres {
	return &OrderPostgres{db: db}
}

func (r *OrderPostgres) Save(order *domain.Order) error {
    var itemNames []string
    for _, b := range order.Items {
        itemNames = append(itemNames, b.Name())
    }
    itemsStr, _ := json.Marshal(itemNames)
    model := model.OrderModel{
        ID:     order.ID,
        CPF:    order.CPF,
        Items:  string(itemsStr),
        Total:  order.TotalPrice,
        Status: order.Status,
    }
    return r.db.Save(&model).Error
}

func (r *OrderPostgres) FindByID(id string) (*domain.Order, error) {
    var model model.OrderModel
    if err := r.db.First(&model, "id = ?", id).Error; err != nil {
        return nil, err
    }

    var itemNames []string
    json.Unmarshal([]byte(model.Items), &itemNames)

    var bebidas []domain.Beverage
    for _, Name := range itemNames {
        b := domain.NewBeverage(Name)
        bebidas = append(bebidas, b)
    }

    order := domain.NewOrder(bebidas)
    order.ID = model.ID
    order.CPF = model.CPF
    order.TotalPrice = model.Total
    order.Status = model.Status
    order.SetState(domain.StateFromStatus(model.Status))
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
        var itemNames []string
        json.Unmarshal([]byte(m.Items), &itemNames)

        var bebidas []domain.Beverage
        for _, Name := range itemNames {
            b := domain.NewBeverage(Name)
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

