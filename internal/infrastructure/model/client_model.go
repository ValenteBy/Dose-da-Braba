package model

type ClienteModel struct {
	CPF        string `gorm:"primaryKey"`
	Nome       string
	Fidelidade int // número de pedidos ou pontos
}