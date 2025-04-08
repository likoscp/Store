package server

import (
	"context"
	"errors"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/likoscp/Store/m_products/internal/config"
	"github.com/likoscp/Store/m_products/internal/handler"
	"github.com/likoscp/Store/m_products/internal/repository" 
	"github.com/likoscp/Store/m_products/internal/service"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)



type Server struct {
	echo *echo.Echo
	cfg  *config.Config
}

func NewServer(cfg *config.Config) *Server {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PATCH, echo.DELETE},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAuthorization},
		AllowCredentials: true,
	}))

	return &Server{
		echo: e,
		cfg:  cfg,
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


	api := s.echo.Group("/microservice")
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

	return s.echo.Start(s.cfg.Addr)
}
