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
