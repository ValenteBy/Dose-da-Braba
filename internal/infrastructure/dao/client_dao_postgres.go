package dao

import (
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/model"
	"gorm.io/gorm"
)

type ClientePostgres struct {
    db *gorm.DB
}

func NewClientePostgres(db *gorm.DB) *ClientePostgres {
    return &ClientePostgres{db: db}
}

func (c *ClientePostgres) Save(cliente *model.ClienteModel) error {
    return c.db.Save(cliente).Error
}

func (c *ClientePostgres) FindByCPF(cpf string) (*model.ClienteModel, error) {
    var cliente model.ClienteModel
    if err := c.db.First(&cliente, "cpf = ?", cpf).Error; err != nil {
        return nil, err
    }
    return &cliente, nil
}