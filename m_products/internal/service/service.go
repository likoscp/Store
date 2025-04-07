package service

import (
	"context"
	"errors"

	"github.com/likoscp/Store/m_products/internal/repository"
	"github.com/likoscp/Store/m_products/models"

)

type ProductService struct {
	repo   *repository.ProductRepository
	secret string
}

func NewProductService(repo *repository.ProductRepository, secret string) *ProductService {
	return &ProductService{
		repo:   repo,
		secret: secret,
	}
}

func (s *ProductService) CreateProduct(ctx context.Context, req models.Product) (string, error) {
	// if _, err := s.repo.GetByName(ctx, req.Name); err == nil {
	// 	return "product already exists", err
	// }
	productID, err := s.repo.CreateProduct(ctx, req)
	if err != nil {
		return "", err
	}
	return productID, nil
}

func (s *ProductService) UpdateProduct(ctx context.Context, id string, req models.Product) error {
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return errors.New("product not found")
	}
	err := s.repo.UpdateProduct(ctx, id, req)
	if err != nil {
		return err
	}
	return nil
}

func (s *ProductService) GetByID(ctx context.Context, id string) (*models.Product, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return product, nil
}

func (s *ProductService) GetAllProducts(ctx context.Context) ([]models.Product, error) {
	product, err := s.repo.GetAllProducts(ctx)
	if err != nil {
		return nil, err
	}
	return product, nil
}

func (s *ProductService) DeleteProduct(ctx context.Context, id string) error {
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return errors.New("product not found")
	}
	err := s.repo.DeleteProduct(ctx, id)
	if err != nil {
		return err
	}
	return nil
}