CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    category VARCHAR(255) NOT NULL,
);
