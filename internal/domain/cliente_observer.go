package domain

import (
	"log"
	"sync"
)

var clienteNotifications = make(map[string][]string)
var mu sync.Mutex

type ClienteObserver struct {
    CPF string
}

func (o ClienteObserver) Update(orderID string, newStatus string) {
	log.Println("Notificando cliente:", o.CPF, orderID, newStatus)
    mu.Lock()
    defer mu.Unlock()
    msg := "Seu pedido " + orderID + " está agora '" + newStatus + "'"
    clienteNotifications[o.CPF] = append(clienteNotifications[o.CPF], msg)
}

// Função para buscar notificações do cliente
func GetClienteNotifications(cpf string) []string {
    mu.Lock()
    defer mu.Unlock()
    log.Println("Buscando notificações para CPF:", cpf)
    notifs := clienteNotifications[cpf]
    log.Println("Notificações encontradas:", notifs)
    if notifs == nil {
        return []string{}
    }
    return notifs
}