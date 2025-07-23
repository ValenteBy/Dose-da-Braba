package domain

import (
	"errors"
)

type OrderState interface {
    Next(o *Order)
    Cancel(o *Order) error
    Name() string // Adicionar este método à interface
}

// Estado RECEBIDO
type stateReceived struct{}

func (stateReceived) Next(o *Order) {
    o.changeState(statePreparing{})
}
func (stateReceived) Cancel(o *Order) error {
    o.changeState(stateCancelled{})
    return nil
}
func (stateReceived) Name() string {
    return "RECEBIDO"
}

// Estado EM PREPARO
type statePreparing struct{}

func (statePreparing) Next(o *Order) {
    o.changeState(stateReady{})
}
func (statePreparing) Cancel(o *Order) error {
    return errors.New("não é possível cancelar: já está em preparo")
}
func (statePreparing) Name() string {
    return "EM PREPARO"
}

// Estado PRONTO
type stateReady struct{}

func (stateReady) Next(o *Order) {
    o.changeState(stateDelivered{})
}
func (stateReady) Cancel(o *Order) error {
    return errors.New("pedido já pronto")
}
func (stateReady) Name() string {
    return "PRONTO"
}

// Estado ENTREGUE
type stateDelivered struct{}

func (stateDelivered) Next(o *Order) {}
func (stateDelivered) Cancel(o *Order) error {
    return errors.New("pedido já entregue")
}
func (stateDelivered) Name() string {
    return "ENTREGUE"
}

// Estado CANCELADO
type stateCancelled struct{}

func (stateCancelled) Next(o *Order) {}
func (stateCancelled) Cancel(o *Order) error {
    return errors.New("pedido já cancelado")
}
func (stateCancelled) Name() string {
    return "CANCELADO"
}

func StateFromStatus(status string) OrderState {
    switch status {
    case "RECEBIDO":
        return stateReceived{}
    case "EM PREPARO":
        return statePreparing{}
    case "PRONTO":
        return stateReady{}
    case "ENTREGUE":
        return stateDelivered{}
    case "CANCELADO":
        return stateCancelled{}
    default:
        return stateReceived{}
    }
}
