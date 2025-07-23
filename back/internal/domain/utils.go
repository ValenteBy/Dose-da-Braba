package domain

import (
	"regexp"
)

func IsValidCPF(cpf string) bool {
	re := regexp.MustCompile(`^\d{11}$`)
	return re.MatchString(cpf)
}

func IsValidAddon(addon string) bool {
	return addon == "LeiteDeAveia" || addon == "Canela" || addon == "SemAcucar"
}

func IsValidPaymentMethod(method string) bool {
	return method == "cartao" || method == "pix"
} 