package cache

import (
    "context"
    "github.com/redis/go-redis/v9"
)

var Ctx = context.Background()

var Client = redis.NewClient(&redis.Options{
    Addr: "redis:6379",
    DB:   0,
})
