package product

import (
	"context"

	"google.golang.org/grpc"
	pb "github.com/likoscp/Store/proto/product"
)

type Client struct {
	conn *grpc.ClientConn
	client pb.ProductServiceClient
}

func NewProductClient(grpcAddr string) (*Client, error) {
	conn, err := grpc.Dial(grpcAddr, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	return &Client{
		conn: conn,
		client: pb.NewProductServiceClient(conn),
	}, nil
}

func (c *Client) UpdateStock(ctx context.Context, req *pb.UpdateProductRequest) (*pb.Empty, error) {
	return c.client.UpdateProduct(ctx, req)
}

func (c *Client) GetProduct(ctx context.Context, req *pb.ProductId) (*pb.Product, error) {
	return c.client.GetProduct(ctx, req)
}

func (c *Client) UpdateProduct(ctx context.Context, req *pb.UpdateProductRequest) (*pb.Empty, error) {
	return c.client.UpdateProduct(ctx, req)
}

func (c *Client) Close() {
	c.conn.Close()
}