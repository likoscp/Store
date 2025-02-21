"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_URL}/Orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data.data)) { 
          setOrders(response.data.data);
        } else {
          setError("Invalid answer");
        }
      })
      .catch((error) => {
        setError("Error loading files: " + error.message);
      });
  }, []);

  return (
    <div>
      <h1>Order List</h1>
      {error && <p>{error}</p>}
      {orders.length === 0 && !error ? (
        <p>No data.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>ID: {order._id} - status: {order.status}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
