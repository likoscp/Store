package config

import (
	// "github.com/joho/godotenv"
	"os"
)

type Config struct {
	Addr       string
	MongoUri   string
	DBname     string
	Collection string
	Secret     string
}

func NewConfig() (*Config, error) {
	return &Config{
		Addr:       os.Getenv("ADDR"),
		MongoUri:   os.Getenv("MONGO"),
		DBname:     os.Getenv("DBname"),
		Collection: os.Getenv("COLLECTION"),
		Secret:     os.Getenv("SECRET"),
	}, nil
}

