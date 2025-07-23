package domain

type Product struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Type  string  `json:"type"` // Adicionar a base (cafe,cha) e extra (Leite de Avela e etc)
}

func NewProduct(name string, price float64, ptype string) Product {
	return Product{
		Name:  name,
		Price: price,
		Type:  ptype,
	}
}