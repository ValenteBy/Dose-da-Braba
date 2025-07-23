package dao

import (
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/model"
	"gorm.io/gorm"
)

type ProductPostgres struct {
	db *gorm.DB
}

func NewProductPostgres(db *gorm.DB) *ProductPostgres {
	return &ProductPostgres{db: db}
} 

func (p *ProductPostgres ) Save(name string,price float64, ptype string) error {
	return p.db.Create(&model.ProductModel{
		Name: name,
		Price: price,
		Type: ptype,
	}).Error
}

func (p *ProductPostgres) FindAll() ([]model.ProductModel, error) {
	var products []model.ProductModel
	err := p.db.Find(&products).Error
	return products, err
}