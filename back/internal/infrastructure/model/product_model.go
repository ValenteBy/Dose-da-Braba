package model

import (
	"gorm.io/gorm"
)

type ProductModel struct {
	gorm.Model
	Name     string  `json:"name"`
	Price    float64 `json:"base_price"`
	Category string  `json:"category"` // "Cafe" ou "Cha"
}

// Para compatibilidade com o frontend
func (p ProductModel) ToMenuItem() map[string]interface{} {
	return map[string]interface{}{
		"id":         p.ID,
		"name":       p.Name,
		"base_price": p.Price,
		"category":   p.Category,
	}
}
