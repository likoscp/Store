package server

import (
	"context"
	"fmt"
	"github.com/likoscp/Store/m_orders/internal/config"
	grpcCustom "github.com/likoscp/Store/m_orders/internal/grpc"
	"github.com/likoscp/Store/m_orders/internal/repository"
	"github.com/likoscp/Store/m_orders/internal/service"
	 "github.com/likoscp/Store/m_producer/pkg/nats"
	// "github.com/nats-io/nats.go"
	orderpb "github.com/likoscp/Store/proto/order"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"log"
	"net"
	"time"
)

type Server struct {
	cfg        *config.Config
	grpcServer *grpc.Server
}

func NewServer(cfg *config.Config) *Server {

	return &Server{
		cfg: cfg,
	}
}
func (s *Server) StartGRPC() error {
	lis, err := net.Listen("tcp", s.cfg.Addr)
	if err != nil {
		log.Printf("❌ Failed to listen: %v", err)
		return fmt.Errorf("failed to listen: %w", err)
	}

	s.grpcServer = grpc.NewServer(
		grpc.UnaryInterceptor(func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
			log.Printf("📨 gRPC request received - Method: %s, Request: %+v", info.FullMethod, req)

			start := time.Now()
			resp, err = handler(ctx, req)

			log.Printf("📤 gRPC response sent - Method: %s, Duration: %v, Error: %v",
				info.FullMethod,
				time.Since(start),
				err)

			return resp, err
		}),
	)

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(s.cfg.MongoUri))
	if err != nil {
		log.Printf("❌ MongoDB connection failed: %v", err)
		return fmt.Errorf("mongo connection failed: %w", err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Printf("❌ MongoDB ping failed: %v", err)
		return fmt.Errorf("mongo ping failed: %w", err)
	}

	log.Println("✅ Successfully connected to MongoDB")

	db := client.Database(s.cfg.DBname)

	orderRepo := repository.NewOrderRepository(db, s.cfg.Collection)
	orderService := service.NewOrderService(orderRepo, s.cfg.Secret)
	

	publisher, err := nats.NewPublisher("nats://nats:4222")
	if err != nil {
		log.Fatalf("failed to create NATS publisher: %v", err)
	}

	orderGRPC := grpcCustom.NewOrderGRPCHandler(orderService, publisher)

	orderpb.RegisterOrderServiceServer(s.grpcServer, orderGRPC)
	reflection.Register(s.grpcServer)
	log.Println("🚀 gRPC server started on port " + s.cfg.Addr)

	if err := s.grpcServer.Serve(lis); err != nil {
		log.Printf("❌ gRPC server failed: %v", err)
		return fmt.Errorf("gRPC server failed: %w", err)
	}

	return nil
}
