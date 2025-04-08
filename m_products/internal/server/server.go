package server

import (
	"context"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/likoscp/Store/m_products/internal/config"
	"github.com/likoscp/Store/m_products/internal/handler"
	"github.com/likoscp/Store/m_products/internal/repository"
	"github.com/likoscp/Store/m_products/internal/service"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Server struct {
	gin  *gin.Engine
	cfg  *config.Config
}

func NewServer(cfg *config.Config) *Server {
	r := gin.Default()
	r.Use(gin.Logger())   
	r.Use(gin.Recovery()) 

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	return &Server{
		gin: r,
		cfg: cfg,
	}
}

func (s *Server) Run() error {
	if s.cfg.DBname == "" {
		return errors.New("DBname is empty! Check .env file")
	}

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(s.cfg.MongoUri))
	if err != nil {
		return err
	}
	defer client.Disconnect(context.Background())

	db := client.Database(s.cfg.DBname)

	productRepo := repository.NewProductRepository(db, s.cfg.Collection)
	productService := service.NewProductService(productRepo, s.cfg.Secret)
	productHandler := handler.NewProductHandler(productService)

	api := s.gin.Group("/microservice")
	{
		product := api.Group("/products")
		{
			product.POST("/", productHandler.CreateProduct)
			product.PATCH("/:id", productHandler.UpdateProduct)
			product.GET("/:id", productHandler.GetById)
			product.GET("/", productHandler.GetAllProducts)
			product.DELETE("/:id", productHandler.DeleteProduct)
		}
	}

	return s.gin.Run(s.cfg.Addr)
}