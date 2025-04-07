package repository

import (
	"context"
	"errors"
	"time"

	"github.com/likoscp/Store/m_auth/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthRepository struct {
	collection *mongo.Collection
}

func NewAuthRepository(db *mongo.Database, collection string) *AuthRepository {
	return &AuthRepository{
		collection: db.Collection(collection),
	}
}

func (r *AuthRepository) GetByEmail(ctx context.Context, email string) (models.User, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return models.User{}, errors.New("user not found")
		}
		return models.User{}, err
	}
	return user, nil
}

func (r *AuthRepository) CreateUser(ctx context.Context, user models.User) (string, error) {
	user.CreatedDate = time.Now()
	res, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		return "", err
	}
	
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		return oid.Hex(), nil
	}
	return "", errors.New("failed to get inserted ID")
}

func (r *AuthRepository) UserExists(ctx context.Context, email string) (bool, error) {
	count, err := r.collection.CountDocuments(ctx, bson.M{"email": email})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}