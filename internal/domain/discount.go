package domain

type DiscountStrategy interface {
	Apply(total float64) float64
	Name() string
}

type FidelityCardDiscount struct{}

func (FidelityCardDiscount) Apply(total float64) float64 {
	return total * 0.90
}

func (FidelityCardDiscount) Name() string {
	return "FIDELIDADE"
}

type PixDiscount struct{}

func (PixDiscount) Apply(total float64) float64 {
	return total * 0.95
}

func (PixDiscount) Name() string {
	return "PIX"
}

// Sem disconto por causa do pagamento via cartão
type NoDiscount struct{}

func (NoDiscount) Apply(total float64) float64 {
	return total
}

func (NoDiscount) Name() string {
	return "SEM DESCONTO"
}