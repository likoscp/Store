package grpc

import (
	"context"

	"github.com/likoscp/Store/m_products/internal/service"
	"github.com/likoscp/Store/m_products/models"
	productpb "github.com/likoscp/Store/proto/product"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type ProductGRPCHandler struct {
	productpb.UnimplementedProductServiceServer
	service *service.ProductService
}

func NewProductGRPCHandler(service *service.ProductService) *ProductGRPCHandler {
	return &ProductGRPCHandler{service: service}
}

func (h *ProductGRPCHandler) CreateProduct(ctx context.Context, req *productpb.CreateProductRequest) (*productpb.CreateProductResponse, error) {
	id, err := h.service.CreateProduct(ctx, models.Product{
		Name:     req.Name,
		Price:    req.Price,
		Stock:    int(req.Stock),
		Category: req.Category,
	})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to create product: %v", err)
	}
	return &productpb.CreateProductResponse{Id: id}, nil
}

func (h *ProductGRPCHandler) GetProduct(ctx context.Context, req *productpb.ProductId) (*productpb.Product, error) {
	p, err := h.service.GetByID(ctx, req.Id)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "product not found: %v", err)
	}
	return &productpb.Product{
		Id:       p.ID.Hex(),
		Name:     p.Name,
		Price:    p.Price,
		Stock:    int32(p.Stock),
		Category: p.Category,
	}, nil
}

func (h *ProductGRPCHandler) ListProducts(ctx context.Context, _ *productpb.Empty) (*productpb.ProductList, error) {
	products, err := h.service.GetAllProducts(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to list products: %v", err)
	}
	var res []*productpb.Product
	for _, p := range products {
		res = append(res, &productpb.Product{
			Id:       p.ID.Hex(),
			Name:     p.Name,
			Price:    p.Price,
			Stock:    int32(p.Stock),
			Category: p.Category,
		})
	}
	return &productpb.ProductList{Products: res}, nil
}

func (h *ProductGRPCHandler) UpdateProduct(ctx context.Context, req *productpb.UpdateProductRequest) (*productpb.Empty, error) {
	err := h.service.UpdateProduct(ctx, req.Id, models.Product{
		Name:     req.Name,
		Price:    req.Price,
		Stock:    int(req.Stock),
		Category: req.Category,
	})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to update: %v", err)
	}
	return &productpb.Empty{}, nil
}

func (h *ProductGRPCHandler) DeleteProduct(ctx context.Context, req *productpb.ProductId) (*productpb.Empty, error) {
	err := h.service.DeleteProduct(ctx, req.Id)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to delete: %v", err)
	}
	return &productpb.Empty{}, nil
}
