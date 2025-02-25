# Store Project

Dias Zakir SE-2320
Sabina Abdikhalikova SE-2320

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Overview
Store is an e-commerce web application that allows users to browse products, add them to the cart, and make purchases. The platform provides an easy-to-use interface for both customers and administrators.

## Features
- User authentication and authorization
- Product catalog with search and filtering
- Shopping cart functionality
- Order management system
- Admin dashboard for product and order management
- Responsive design for mobile and desktop

## Technologies Used
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT, bcrypt
- **Hosting & Deployment:** Vercel, Render

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/likoscp/store.git
   cd store
   ```
2. Install dependencies for frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the frontend/backend directory with required API keys and database credentials.
   
4. Start the development server:
   ```bash
   cd backend
   node app.js
   ```
   In a separate terminal:
   ```bash
   cd frontend
   npm run dev
   ```

## Usage
- Open the browser and go to `http://localhost:4000` to view the store.
- Sign up or log in to start shopping.
- Add items to the cart and proceed to checkout.
- Admin users can access the dashboard to manage products and orders.

# API Documentation

## Authentication.js
### **POST /api/auth/login**
- Description: Logs in a user.
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "token": "jwt_token",
    "user": { "id": "123", "name": "John Doe" }
  }
  ```

### **POST /api/auth/register**
- Description: Registers a new user.
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

## Filters.js
### **GET /api/filters**
- Description: Retrieves available filters for products.
- Response:
  ```json
  {
    "categories": ["Electronics", "Clothing"],
    "priceRange": { "min": 10, "max": 1000 }
  }
  ```

## Messages.js
### **GET /api/messages**
- Description: Retrieves user messages.
- Response:
  ```json
  [{ "id": "1", "sender": "Admin", "text": "Hello!" }]
  ```

## Orders.js
### **GET /api/orders**
- Description: Retrieves a user's orders.
- Response:
  ```json
  [{ "id": "1", "total": 100, "status": "Shipped" }]
  ```

## Posts.js
### **GET /api/posts**
- Description: Retrieves blog posts.
- Response:
  ```json
  [{ "id": "1", "title": "New Arrival", "content": "Check out our new products." }]
  ```

## Products.js
### **GET /api/products**
- Description: Retrieves available products.
- Response:
  ```json
  [{ "id": "1", "name": "Laptop", "price": 999.99 }]
  ```

## Tickets.js
### **POST /api/tickets**
- Description: Creates a support ticket.
- Request Body:
  ```json
  {
    "userId": "123",
    "message": "I need help with my order."
  }
  ```
- Response:
  ```json
  {
    "message": "Ticket created successfully"
  }
  ```

## Users.js
### **GET /api/users**
- Description: Retrieves all users (Admin only).
- Response:
  ```json
  [{ "id": "123", "name": "John Doe", "email": "user@example.com" }]
  ```
