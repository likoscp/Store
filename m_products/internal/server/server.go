package server

import (
	"context"
	"fmt"
	"log"
	"time"
	"github.com/likoscp/Store/m_products/internal/config"
	"net"
	grpcCustom "github.com/likoscp/Store/m_products/internal/grpc"
	"github.com/likoscp/Store/m_products/internal/repository"
	"github.com/likoscp/Store/m_products/internal/service"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"

	productpb "github.com/likoscp/Store/proto/product"
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

	productRepo := repository.NewProductRepository(db, s.cfg.Collection)
	productService := service.NewProductService(productRepo, s.cfg.Secret)
	productGRPC := grpcCustom.NewProductGRPCHandler(productService)

	productpb.RegisterProductServiceServer(s.grpcServer, productGRPC)

	log.Println("🚀 gRPC server started on port " + s.cfg.Addr)
	
	if err := s.grpcServer.Serve(lis); err != nil {
		log.Printf("❌ gRPC server failed: %v", err)
		return fmt.Errorf("gRPC server failed: %w", err)
	}

	return nil
}