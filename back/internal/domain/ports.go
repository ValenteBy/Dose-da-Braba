package domain

type OrderDAO interface {
	Save(order *Order) error
	FindByID(id string) (*Order, error)
}