package grpc

import (
	"context"

	"github.com/likoscp/Store/m_orders/internal/service"
	"github.com/likoscp/Store/m_orders/models"
	orderpb "github.com/likoscp/Store/proto/order"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type OrderGRPCHandler struct {
	orderpb.UnimplementedOrderServiceServer
	service *service.OrderService
}

func NewOrderGRPCHandler(service *service.OrderService) *OrderGRPCHandler {
	return &OrderGRPCHandler{service: service}
}

func (h *OrderGRPCHandler) CreateOrder(ctx context.Context, req *orderpb.CreateOrderRequest) (*orderpb.CreateOrderResponse, error) {
	orderItems := make([]models.OrderItem, len(req.Items))
	for i, item := range req.Items {
		orderItems[i] = models.OrderItem{
			ProductID: func() primitive.ObjectID {
				id, err := primitive.ObjectIDFromHex(item.ProductId)
				if err != nil {
					panic("invalid ObjectID format for ProductId")
				}
				return id
			}(),
			Quantity:  int(item.Quantity),
		}
	}

	order := models.Order{
		UserID: func() primitive.ObjectID {
			id, err := primitive.ObjectIDFromHex(req.UserId)
			if err != nil {
				panic("invalid ObjectID format for UserId")
			}
			return id
		}(),
		Items:      orderItems,
		Status:     req.Status,
		OrderDate:  primitive.NewDateTimeFromTime(req.OrderDate.AsTime()),
		TotalPrice: req.TotalPrice,
	}

	id, err := h.service.CreateOrder(ctx, order)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to create order: %v", err)
	}

	return &orderpb.CreateOrderResponse{Id: id}, nil
}

func (h *OrderGRPCHandler) GetOrderById(ctx context.Context, req *orderpb.OrderIdRequest) (*orderpb.Order, error) {
	order, err := h.service.GetByID(ctx, req.Id)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "order not found: %v", err)
	}

	var items []*orderpb.OrderItem
	for _, item := range order.Items {
		items = append(items, &orderpb.OrderItem{
			Id:        item.ID.Hex(),
			ProductId: item.ProductID.Hex(),
			Quantity:  int32(item.Quantity),
		})
	}

	return &orderpb.Order{
		Id:         order.ID.Hex(),
		UserId:     order.UserID.Hex(),
		Items:      items,
		Status:     order.Status,
		OrderDate:  timestamppb.New(order.OrderDate.Time()),
		TotalPrice: order.TotalPrice,
	}, nil
}

func (h *OrderGRPCHandler) ListOrders(ctx context.Context, _ *orderpb.Empty) (*orderpb.OrderList, error) {
	orders, err := h.service.GetAllOrders(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to list orders: %v", err)
	}
	var res []*orderpb.Order
	for _, order := range orders {
		var items []*orderpb.OrderItem
		for _, item := range order.Items {
			items = append(items, &orderpb.OrderItem{
				Id:        item.ID.Hex(),
				ProductId: item.ProductID.Hex(),
				Quantity:  int32(item.Quantity),
			})
		}
		res = append(res, &orderpb.Order{
			Id:         order.ID.Hex(),
			UserId:     order.UserID.Hex(),
			Items:      items,
			Status:     order.Status,
			OrderDate:  timestamppb.New(order.OrderDate.Time()),
			TotalPrice: order.TotalPrice,
		})
	}
	return &orderpb.OrderList{Orders: res}, nil
}
func (h *OrderGRPCHandler) UpdateOrder(ctx context.Context, req *orderpb.UpdateOrderRequest) (*orderpb.Empty, error) {
	orderItems := make([]models.OrderItem, len(req.Items))
	for i, item := range req.Items {
		orderItems[i] = models.OrderItem{
			ID: func() primitive.ObjectID {
				id, err := primitive.ObjectIDFromHex(item.Id)
				if err != nil {
					panic("invalid ObjectID format for item.Id")
				}
				return id
			}(),
			ProductID: func() primitive.ObjectID {
				id, err := primitive.ObjectIDFromHex(item.ProductId)
				if err != nil {
					panic("invalid ObjectID format for ProductId")
				}
				return id
			}(),
			Quantity:  int(item.Quantity),
		}
	}

	err := h.service.UpdateOrder(ctx, req.Id, models.Order{
		UserID: func() primitive.ObjectID {
			id, err := primitive.ObjectIDFromHex(req.Id)
			if err != nil {
				panic("invalid ObjectID format for UserId")
			}
			return id
		}(),
		Items:      orderItems,
		Status:     req.Status,
		OrderDate:  primitive.NewDateTimeFromTime(req.OrderDate.AsTime()),
		TotalPrice: req.TotalPrice,
	})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to update: %v", err)
	}
	return &orderpb.Empty{}, nil
}

func (h *OrderGRPCHandler) DeleteOrder(ctx context.Context, req *orderpb.DeleteOrderRequest) (*orderpb.Empty, error) {
	err := h.service.DeleteOrder(ctx, req.Id)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to delete: %v", err)
	}
	return &orderpb.Empty{}, nil
}

func (h *OrderGRPCHandler) PayOrder(ctx context.Context, req *orderpb.PayOrderRequest) (*orderpb.PayOrderResponse, error) {
	_, err := h.service.PayOrder(ctx, req.UserId, req.OrderIds)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to delete: %v", err)
	}
	return&orderpb.PayOrderResponse{}, nil
}

