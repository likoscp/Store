package models

import (
	"time"
	
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name          string             `bson:"name" json:"name" validate:"required"`
	Email         string             `bson:"email" json:"email" validate:"required,email"`
	Phone         string             `bson:"phone" json:"phone" validate:"required"`
	Address       string             `bson:"address,omitempty" json:"address,omitempty"`
	Status        string             `bson:"status" json:"status" validate:"required"` 
	LoyalityLevel int                `bson:"loyalityLevel" json:"loyalityLevel"`
	Role          string             `bson:"role" json:"role" validate:"required"`     
	CreatedDate   time.Time          `bson:"created_date" json:"created_date"`
	HashPassword  string             `bson:"hashPassword" json:"-" validate:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type RegisterRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Phone    string `json:"phone" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}