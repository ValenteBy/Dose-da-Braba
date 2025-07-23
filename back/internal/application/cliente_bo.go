package application

import (
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/dao"
	"github.com/ValenteBy/Dose-da-Braba/internal/infrastructure/model"
)

type ClienteBO struct {
    ClienteRepo *dao.ClientePostgres
}

func (bo *ClienteBO) RegistrarOuAtualizarCliente(cpf, nome string) error {
    cliente, err := bo.ClienteRepo.FindByCPF(cpf)
    if err != nil {
        cliente = &model.ClienteModel{CPF: cpf, Nome: nome, Fidelidade: 0}
    }
    // Atualize nome se necessário
    cliente.Nome = nome
    return bo.ClienteRepo.Save(cliente)
}

func (bo *ClienteBO) AdicionarFidelidade(cpf string) error {
    cliente, err := bo.ClienteRepo.FindByCPF(cpf)
    if err != nil {
        return err
    }
    cliente.Fidelidade++
    return bo.ClienteRepo.Save(cliente)
}