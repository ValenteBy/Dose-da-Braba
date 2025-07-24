package application

type PlaceOrderItem struct {
	Base   string   `json:"base"`
	Addons []string `json:"addons"`
}

type PlaceOrderDTO struct {
	CPF   string           `json:"cpf"`
	Items []PlaceOrderItem `json:"items"`
}

type UpdateStatusDTO struct {
	Status string `json:"status"`
}

type PayDTO struct {
	CPF           string `json:"cpf"`
	PaymentMethod string `json:"payment_method"`
}

type OrderItemResponse struct {
	Base   string   `json:"base"`
	Addons []string `json:"addons"`
}

type OrderResponse struct {
	ID         string              `json:"id"`
	CPF        string              `json:"cpf"`
	Items      []OrderItemResponse `json:"items"`
	Status     string              `json:"status"`
	TotalPrice float64             `json:"total_price"`
}