package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/likoscp/Store/m_orders/internal/service"
	"github.com/likoscp/Store/m_orders/models"
)

type OrderHandler struct {
	service *service.OrderService
}

type PayOrderRequest struct {
	Orders []struct {
		OrderID string `json:"orders_id"`
	} `json:"orders"`
}

func NewOrderHandler(service *service.OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req models.Order
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	orderID, err := h.service.CreateOrder(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id": orderID,
	})
}

func (h *OrderHandler) UpdateOrder(c *gin.Context) {
	var req models.Order
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	orderID := c.Param("id")
	err := h.service.UpdateOrder(c.Request.Context(), orderID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (h *OrderHandler) GetById(c *gin.Context) {
	orderID := c.Param("id")
	order, err := h.service.GetByID(c.Request.Context(), orderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, order)
}

func (h *OrderHandler) GetAllOrders(c *gin.Context) {
	orders, err := h.service.GetAllOrders(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(orders) == 0 {
		log.Println("No orders found")
	}
	c.JSON(http.StatusOK, orders)
}

func (h *OrderHandler) DeleteOrder(c *gin.Context) {
	orderID := c.Param("id")
	err := h.service.DeleteOrder(c.Request.Context(), orderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (h *OrderHandler) PayOrder(c *gin.Context) {
	userID := c.Param("id")

	var req PayOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	var orderIDs []string
	for _, o := range req.Orders {
		orderIDs = append(orderIDs, o.OrderID)
	}

	orders, err := h.service.PayOrder(c.Request.Context(), userID, orderIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}
