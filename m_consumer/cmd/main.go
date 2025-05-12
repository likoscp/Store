package main

import (
    "log"
    "github.com/likoscp/Store/m_consumer/internal/nats"
    "github.com/likoscp/Store/m_consumer/internal/product"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	productClient, err := product.NewProductClient("product-service:50052")
	if err != nil {
		log.Fatalf("Failed to connect to product-service: %v", err)
	}
	defer productClient.Close()

	subscriber, err := nats.NewSubscriber("nats://nats:4222", productClient)
	if err != nil {
		log.Fatalf("Failed to connect to NATS: %v", err)
	}
	defer subscriber.Close()

	subscriber.SubscribeToOrderCreated()
	log.Println("Consumer service subscribed to order.created events")

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan
	log.Println("Shutting down consumer service...")
}