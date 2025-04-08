package main

import (
	"github.com/gin-gonic/gin"
	"net/http/httputil"
	"net/url"

)

func main() {
	r := gin.Default()

	authTarget, _ := url.Parse("http://localhost:8080")
	authProxy := httputil.NewSingleHostReverseProxy(authTarget)

	productTarget, _ := url.Parse("http://localhost:8082")
	productProxy := httputil.NewSingleHostReverseProxy(productTarget)

	r.POST("/login", func(c *gin.Context) {
		c.Request.URL.Path = "/microservice/auth/login"
		authProxy.ServeHTTP(c.Writer, c.Request)
	})

	r.POST("/register", func(c *gin.Context) {
		c.Request.URL.Path = "/microservice/auth/register"
		authProxy.ServeHTTP(c.Writer, c.Request)
	})

	r.Any("/products", func(c *gin.Context) {
		c.Request.URL.Path = "/microservice/products"
		productProxy.ServeHTTP(c.Writer, c.Request)
	})

	r.Any("/products/", func(c *gin.Context) {
		c.Request.URL.Path = "/microservice/products/"
		productProxy.ServeHTTP(c.Writer, c.Request)
	})

	r.Any("/products/:id", func(c *gin.Context) {
		c.Request.URL.Path = "/microservice/products/" + c.Param("id")
		productProxy.ServeHTTP(c.Writer, c.Request)
	})

	r.Run(":8081")
}
