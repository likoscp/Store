package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/likoscp/Store/m_products/internal/service"
	"github.com/likoscp/Store/m_products/models"
)

type ProductHandler struct {
	service *service.ProductService
}

func NewProductHandler(service *service.ProductService) *ProductHandler {
	return &ProductHandler{service: service}
}

func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var req models.Product
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	productID, err := h.service.CreateProduct(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id": productID,
	})
}

func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	var req models.Product
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	productID := c.Param("id")
	err := h.service.UpdateProduct(c.Request.Context(), productID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (h *ProductHandler) GetById(c *gin.Context) {
	productID := c.Param("id")
	product, err := h.service.GetByID(c.Request.Context(), productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) GetAllProducts(c *gin.Context) {
	products, err := h.service.GetAllProducts(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(products) == 0 {
		log.Println("No products found")
	}
	c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	productID := c.Param("id")
	err := h.service.DeleteProduct(c.Request.Context(), productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}