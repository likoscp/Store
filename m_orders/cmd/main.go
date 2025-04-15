package main

import (

	"github.com/likoscp/Store/m_orders/internal/config"
	"github.com/likoscp/Store/m_orders/internal/server"
	log "github.com/sirupsen/logrus"
	
)

func main() {
	c, err := config.NewConfig()
	if err != nil {
		log.Fatal("Config error:", err) 
	}
	s := server.NewServer(c)

	if err := s.StartGRPC(); err != nil {
		log.Fatalf("!!! gRPC server failed: %v", err) 
	}
}