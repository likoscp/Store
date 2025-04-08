package handler

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/likoscp/Store/m_products/internal/service"
	"github.com/likoscp/Store/m_products/models"
)

type ProductHandler struct {
	service *service.ProductService
}

func NewProductHandler(service *service.ProductService) *ProductHandler {
	return &ProductHandler{service: service}
}

func (h *ProductHandler) CreateProduct(c echo.Context) error {
	var req models.Product
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	productID, err := h.service.CreateProduct(c.Request().Context(), req)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"id":    productID,
	})
}

func (h *ProductHandler) UpdateProduct(c echo.Context) error {
	var req models.Product
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	productID := c.Param("id")
	err := h.service.UpdateProduct(c.Request().Context(), productID, req)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.NoContent(http.StatusOK)
}

func (h *ProductHandler) GetById(c echo.Context) error {
	productID := c.Param("id")
	product, err := h.service.GetByID(c.Request().Context(), productID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) GetAllProducts(c echo.Context) error {
    products, err := h.service.GetAllProducts(c.Request().Context())
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
    }
    if len(products) == 0 {
        log.Println("No products found")
    }
    return c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) DeleteProduct(c echo.Context) error {
	productID := c.Param("id")
	err := h.service.DeleteProduct(c.Request().Context(), productID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.NoContent(http.StatusOK)
}