package model

type OrderModel struct {
	ID     string `gorm:"primaryKey"`
	CPF    string
	Items  string
	Total  float64
	Status string
}