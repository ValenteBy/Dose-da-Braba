package model

type ItemPersist struct {
	Base   string   `json:"base"`
	Addons []string `json:"addons"`
}