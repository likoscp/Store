package repository

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/likoscp/Store/m_orders/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderRepository struct {
	collection *mongo.Collection
}

func NewOrderRepository(db *mongo.Database, collection string) *OrderRepository {
	return &OrderRepository{
		collection: db.Collection(collection),
	}
}

func (r *OrderRepository) CreateOrder(ctx context.Context, order models.Order) (string, error) {
	if order.UserID.String() == "" || order.Items == nil || order.TotalPrice <= 0 {
		return "", errors.New("order has invalid or empty fields")
	}

	res, err := r.collection.InsertOne(ctx, order)
	if err != nil {
		return "", err
	}

	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		return oid.Hex(), nil
	}
	return "", errors.New("failed to get inserted ID")
}

func (r *OrderRepository) GetByID(ctx context.Context, id string) (*models.Order, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var order models.Order
	err = r.collection.FindOne(ctx, bson.M{"_id": oid}).Decode(&order)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("order no found")
		}
		return nil, err
	}

	return &order, nil
}

func (r *OrderRepository) GetAllOrders(ctx context.Context) ([]models.Order, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	for cursor.Next(ctx) {
		var order models.Order
		if err := cursor.Decode(&order); err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return orders, nil
}

func (r *OrderRepository) UpdateOrder(ctx context.Context, id string, order models.Order) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	update := bson.M{
		"$set": order,
	}

	result, err := r.collection.UpdateOne(ctx, bson.M{"_id": oid}, update)
	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("no documents updated")
	}
	return nil
}

func (r *OrderRepository) DeleteOrder(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	result, err := r.collection.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return errors.New("order not found")
	}

	return nil
}

func (r *OrderRepository) PayOrder(ctx context.Context, userID string, orderIDs []string) ([]models.Order, error) {
	uid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	var objIDs []primitive.ObjectID
	for _, id := range orderIDs {
		oid, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return nil, fmt.Errorf("invalid order ID: %s", id)
		}
		objIDs = append(objIDs, oid)
	}

	session, err := r.collection.Database().Client().StartSession()
	if err != nil {
		return nil, err
	}
	defer session.EndSession(ctx)

	var orders []models.Order

	err = mongo.WithSession(ctx, session, func(sc mongo.SessionContext) error {
		if err := session.StartTransaction(); err != nil {
			return err
		}

		filter := bson.M{
			"_id":     bson.M{"$in": objIDs},
			"user_id": uid,
			"status":  "pending",
		}
		
		cursor, err := r.collection.Find(sc, filter)
		if err != nil {
			return err
		}
		defer cursor.Close(sc)
		
		for cursor.Next(sc) {
			var order models.Order
			if err := cursor.Decode(&order); err != nil {
				return err
			}
			orders = append(orders, order)
		}
		
		if len(orders) == 0 {
			return errors.New("no pending orders found for the user and provided IDs")
		}
		
		_, err = r.collection.UpdateMany(sc, filter, bson.M{"$set": bson.M{"status": "paid"}})
		if err != nil {
			return err
		}
		
		log.Printf("Count Orders: %d", len(orders))
		return session.CommitTransaction(sc)
	})
	log.Printf("After transaction: %d", len(orders))

	if err != nil {
		log.Printf("❌ Failed to pay orders: %v", err)

		return nil, err
	}

	for i := range orders {
		orders[i].Status = "paid"
		log.Printf("Order %s paid successfully", orders[i].ID.Hex())
	}
	log.Println("✅ Orders paid successfully")

	return orders, nil
}
