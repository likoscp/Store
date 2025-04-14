package service

import (
	"context"
	"errors"

	"github.com/likoscp/Store/m_orders/internal/repository"
	"github.com/likoscp/Store/m_orders/models"
)

type OrderService struct {
	repo   *repository.OrderRepository
	secret string
}

func NewOrderService(repo *repository.OrderRepository, secret string) *OrderService {
	return &OrderService{
		repo:   repo,
		secret: secret,
	}
}

func (s *OrderService) CreateOrder(ctx context.Context, req models.Order) (string, error) {

	orderID, err := s.repo.CreateOrder(ctx, req)
	if err != nil {
		return "", err
	}
	return orderID, nil
}

func (s *OrderService) UpdateOrder(ctx context.Context, id string, req models.Order) error {
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return errors.New("order not found")
	}
	err := s.repo.UpdateOrder(ctx, id, req)
	if err != nil {
		return err
	}
	return nil
}

func (s *OrderService) GetByID(ctx context.Context, id string) (*models.Order, error) {
	order, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return order, nil
}

func (s *OrderService) GetAllOrders(ctx context.Context) ([]models.Order, error) {
	order, err := s.repo.GetAllOrders(ctx)
	if err != nil {
		return nil, err
	}
	return order, nil
}

func (s *OrderService) DeleteOrder(ctx context.Context, id string) error {
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return errors.New("order not found")
	}
	err := s.repo.DeleteOrder(ctx, id)
	if err != nil {
		return err
	}
	return nil
}

func (s *OrderService) PayOrder(ctx context.Context, userID string, orderIDs []string) ([]models.Order, error) {
	return s.repo.PayOrder(ctx, userID, orderIDs)
}
