package domain

type beverageDecorator struct {
	beverage Beverage
}

type OatMilk struct {
	beverageDecorator
}

func (o OatMilk) Name() string   { return o.beverage.Name() + " com leite de aveia" }
func (o OatMilk) Price() float64 { return o.beverage.Price() + 2.0 }
func (o OatMilk) Base() string   { return o.beverage.Base() }
func (o OatMilk) Addons() []string {
	return append(o.beverage.Addons(), "LeiteDeAveia")
}

type Cinnamon struct {
	beverageDecorator
}

func (c Cinnamon) Name() string   { return c.beverage.Name() + " com canela" }
func (c Cinnamon) Price() float64 { return c.beverage.Price() + 1.0 }
func (c Cinnamon) Base() string   { return c.beverage.Base() }
func (c Cinnamon) Addons() []string {
	return append(c.beverage.Addons(), "Canela")
}

type NoSugar struct {
	beverageDecorator
}

func (n NoSugar) Name() string   { return n.beverage.Name() + " sem açúcar" }
func (n NoSugar) Price() float64 { return n.beverage.Price() }
func (n NoSugar) Base() string   { return n.beverage.Base() }
func (n NoSugar) Addons() []string {
	return append(n.beverage.Addons(), "SemAcucar")
}

func ApplyAddons(base Beverage, addons []string) Beverage {
	// Trocar o caso para um IF
	for _, addon := range addons {
		switch addon {
		case "LeiteDeAveia":
			base = OatMilk{beverageDecorator{base}}
		case "Canela":
			base = Cinnamon{beverageDecorator{base}}
		case "SemAcucar":
			base = NoSugar{beverageDecorator{base}}
		}
	}
	return base
}
