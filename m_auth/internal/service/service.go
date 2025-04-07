package service

import (
	"context"
	"errors"

	"github.com/likoscp/Store/m_auth/models"
	"github.com/likoscp/Store/m_auth/internal/repository"
	"github.com/likoscp/Store/m_auth/pkg"
)

type AuthService struct {
	repo   *repository.AuthRepository
	secret string
}

func NewAuthService(repo *repository.AuthRepository, secret string) *AuthService {
	return &AuthService{
		repo:   repo,
		secret: secret,
	}
}

func (s *AuthService) Register(ctx context.Context, req models.RegisterRequest) (string, error) {
	exists, err := s.repo.UserExists(ctx, req.Email)
	if err != nil {
		return "", err
	}
	if exists {
		return "", errors.New("user already exists")
	}

	hash, err := pkg.HashPassword(req.Password)
	if err != nil {
		return "", err
	}
// fefault values for user
	user := models.User{
		Name:         req.Name,
		Email:        req.Email,
		Phone:        req.Phone,
		Status:       "active",
		Role:         "user", // Role: "admin",
		HashPassword: hash,
	}

	userID, err := s.repo.CreateUser(ctx, user)
	if err != nil {
		return "", err
	}

	return userID, nil
}

func (s *AuthService) Login(ctx context.Context, req models.LoginRequest) (string, error) {
	user, err := s.repo.GetByEmail(ctx, req.Email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	if !pkg.CheckPasswordHash(req.Password, user.HashPassword) {
		return "", errors.New("invalid credentials")
	}

	token, err := pkg.GenerateJWT(user.ID.Hex(), user.Email, user.Role, s.secret)
	if err != nil {
		return "", err
	}

	return token, nil
}