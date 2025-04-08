package server

import (
	"context"
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/likoscp/Store/m_auth/internal/config"
	"github.com/likoscp/Store/m_auth/internal/handler"
	"github.com/likoscp/Store/m_auth/internal/repository" 
	"github.com/likoscp/Store/m_auth/internal/service"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

type Server struct {
	echo *echo.Echo
	cfg  *config.Config
}

func NewServer(cfg *config.Config) *Server {
	e := echo.New()
	
	e.Validator = &CustomValidator{validator: validator.New()}
	
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

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

	authRepo := repository.NewAuthRepository(db, s.cfg.Collection)
	authService := service.NewAuthService(authRepo, s.cfg.Secret)
	authHandler := handler.NewAuthHandler(authService)

	api := s.echo.Group("/microservice")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/verify", authHandler.Verify)
		}
	}

	return s.echo.Start(s.cfg.Addr)
}