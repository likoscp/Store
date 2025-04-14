package main

import (
	"net/http/httputil"
	"net/url"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(gin.Logger())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	authTarget, err := url.Parse("http://localhost:8080")
	if err != nil {
		panic("Invalid auth target URL: " + err.Error())
	}
	authProxy := httputil.NewSingleHostReverseProxy(authTarget)
	orderTarget, err := url.Parse("http://localhost:8083")
	if err != nil {
		panic("Invalid order target URL: " + err.Error())
	}
	orderProxy := httputil.NewSingleHostReverseProxy(orderTarget)
	productTarget, err := url.Parse("http://localhost:8082")
	if err != nil {
		panic("Invalid product target URL: " + err.Error())
	}
	productProxy := httputil.NewSingleHostReverseProxy(productTarget)

	r.POST("/login", func(c *gin.Context) {
		c.Request.URL.Path = "/microservice/auth/login"
		authProxy.ServeHTTP(c.Writer, c.Request)
	})

	r.POST("/register", func(c *gin.Context) {
		c.Request.URL.Path = "/microservice/auth/register"
		authProxy.ServeHTTP(c.Writer, c.Request)

	})

	productProxyHandler := func(c *gin.Context) {
		id := c.Param("id")
		if id != "" {
			c.Request.URL.Path = "/microservice/products/" + id
		} else {
			c.Request.URL.Path = "/microservice/products/"
		}
		// c.Writer.WriteString("Updated Path: " + c.Request.URL.Path + "\n")
		productProxy.ServeHTTP(c.Writer, c.Request)
	}

	r.Any("/products/", productProxyHandler)
	r.Any("/products/:id", productProxyHandler)

	orderProxyHandler := func(c *gin.Context) {
		id := c.Param("id")
		if id != "" {
			c.Request.URL.Path = "/microservice/orders/" + id
		} else {
			c.Request.URL.Path = "/microservice/orders/"
		}
		// c.Writer.WriteString("Updated Path: " + c.Request.URL.Path + "\n")
		orderProxy.ServeHTTP(c.Writer, c.Request)
	}

	r.Any("/orders/", orderProxyHandler)
	r.Any("/orders/:id", orderProxyHandler)
	
	r.Run(":8081")
}
