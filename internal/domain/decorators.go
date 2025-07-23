package domain

type beverageDecorator struct {
	beverage Beverage
}

type OatMilk struct {
	beverageDecorator
}

func (d OatMilk) Name() string {
	return d.beverage.Name() + " com leite de aveia"
}
func (d OatMilk) Price() float64 {
	return d.beverage.Price() + 2.0
}

type Cinnamon struct {
	beverageDecorator
}

func (d Cinnamon) Name() string {
	return d.beverage.Name() + " com canela"
}
func (d Cinnamon) Price() float64 {
	return d.beverage.Price() + 1.0
}

type NoSugar struct {
	beverageDecorator
}

func (d NoSugar) Name() string {
	return d.beverage.Name() + " sem açúcar"
}
func (d NoSugar) Price() float64 {
	return d.beverage.Price() + 0.0
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
