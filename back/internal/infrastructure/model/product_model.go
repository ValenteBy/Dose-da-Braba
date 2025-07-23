package model

import (
	"gorm.io/gorm"
)

type ProductModel struct {
	gorm.Model
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Type  string  `json:"type"` // "base" ou "addon"
}
