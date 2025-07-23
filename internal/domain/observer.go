package domain

import (
	"fmt"
)

type Observer interface {
	Update(orderID string, newStatus string)
}

type Subject interface {
	Attach(observer Observer)
	Notify()
}

type ConsoleObserver struct {
	Name string
}

func (c ConsoleObserver) Update(orderID string, newStatus string) {
	fmt.Printf("[%s] Pedido %s mudou para: %s\n", c.Name, orderID, newStatus)
}
