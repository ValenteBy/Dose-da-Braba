package domain

import (
	"github.com/google/uuid"
)

type Order struct {
    ID         string
	CPF 	   string
    Items      []Beverage
    Status     string
    observers  []Observer
    TotalPrice float64
    state      OrderState
}

func NewOrder(items []Beverage) *Order {
    id := uuid.New().String()
    total := 0.0
    for _, item := range items {
        total += item.Price()
    }
    return &Order{
        ID:         id,
        Items:      items,
        Status:     "RECEBIDO",
        observers:  []Observer{},
        TotalPrice: total,
        state:      stateReceived{},
    }
}

// Observer
func (o *Order) Attach(observer Observer) {
    o.observers = append(o.observers, observer)
}

func (o *Order) Notify() {
    for _, obs := range o.observers {
        obs.Update(o.ID, o.Status)
    }
}

// State
func (o *Order) UpdateStatus(newStatus string) {
    o.Status = newStatus
    o.Notify()
}

// Func para trocar o estado e atualizar Status
func (o *Order) changeState(state OrderState) {
    o.state = state
    o.Status = state.Name()
    o.Notify()
}

// Avança para o próximo estado (usado pelo endpoint PATCH com "NEXT", Ex: PATCH .../api/orders/:id/next)
func (o *Order) NextStatus() {
    o.state.Next(o)
    o.Status = o.state.Name()
}

// Cancela o pedido (usado pelo endpoint de cancelamento)
func (o *Order) Cancel() error {
    err := o.state.Cancel(o)
    if err == nil {
        o.Notify()
    }
    return err
}

// Permite restaurar o estado correto ao buscar do banco
func (o *Order) SetState(state OrderState) {
    o.state = state
}