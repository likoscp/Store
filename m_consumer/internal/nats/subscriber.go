package nats

import (
	"context"
	"encoding/json"
	"log"

	"github.com/nats-io/nats.go"
	"github.com/likoscp/Store/m_consumer/internal/product"
	pb "github.com/likoscp/Store/proto/product"
)

type Subscriber struct {
	conn      *nats.Conn
	productClient *product.Client
}

func NewSubscriber(natsURL string, productClient *product.Client) (*Subscriber, error) {
	nc, err := nats.Connect(natsURL)
	if err != nil {
		return nil, err
	}
	return &Subscriber{conn: nc, productClient: productClient}, nil
}

func (s *Subscriber) SubscribeToOrderCreated() {
	s.conn.Subscribe("order.created", func(msg *nats.Msg) {
		var order struct {
			Items []struct {
				ProductID string `json:"productId"`
				Quantity  int    `json:"quantity"`
			} `json:"items"`
		}
		

		if err := json.Unmarshal(msg.Data, &order); err != nil {
			log.Printf("Error unmarshaling order: %v", err)
			return
		}

		for _, item := range order.Items {
			productResp, err := s.productClient.GetProduct(context.Background(), &pb.ProductId{
				Id: item.ProductID,
			})
			if err != nil {
				log.Printf("Failed to fetch product %s: %v", item.ProductID, err)
				continue
			}
		
			newStock := productResp.Stock - int32(item.Quantity)
		
			req := &pb.UpdateProductRequest{
				Id:       productResp.Id,
				Name:     productResp.Name,
				Price:    productResp.Price,
				Stock:    newStock,
				Category: productResp.Category,
			}
		
			if _, err := s.productClient.UpdateProduct(context.Background(), req); err != nil {
				log.Printf("Failed to update stock for product %s: %v", item.ProductID, err)
				continue
			}
		
			log.Printf("Stock updated for product %s, quantity decreased by %d", item.ProductID, item.Quantity)
		}
		
		
	})
}

func (s *Subscriber) Close() {
	s.conn.Close()
}