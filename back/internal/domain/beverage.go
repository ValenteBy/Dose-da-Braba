package domain

type Beverage interface {
	Price() float64
	Name() string
	Base() string
	Addons() []string
}

// Para coffee - preço base do café
type coffe struct{}

func (coffe) Price() float64   { return 15.99 } // Preço base do café (média dos cafés)
func (coffe) Name() string     { return "Cafe" }
func (coffe) Base() string     { return "Cafe" }
func (coffe) Addons() []string { return []string{} }

// Para tea - preço base do chá  
type tea struct{}

func (tea) Price() float64   { return 11.99 } // Preço base do chá (média dos chás)
func (tea) Name() string     { return "Cha" }
func (tea) Base() string     { return "Cha" }
func (tea) Addons() []string { return []string{} }

func NewBeverage(kind string) Beverage {
	if kind == "Cha" {
		return tea{}
	}
	if kind == "Cafe" {
		return coffe{}
	}
	// Lembrar de corrigir o erro aqui
	// return errors.New("Beverage not found")
	// para não retornar qualquer coisa, pode ser tratado no front ou melhor aqui?
	return coffe{}

}