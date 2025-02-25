"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function OrderPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchOrder = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token not found, please sign in.");
        window.location.href = '/sign-in'; 
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https//store-gyhu.vercel.app/orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          console.log("Order data:", response.data); 
          setOrder(response.data);
        } else {
          setError("Order not found.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.href = '/sign-in';
        } else {
          setError("Error fetching order: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <h1>Order Details</h1>
      <ul>
        <li>
          <strong>ID:</strong> {order._id} <br />
          <strong>User ID:</strong> {order.userId} <br />
          <strong>Status:</strong> {order.status} <br />
          <strong>Order Date:</strong> {order.order_date} <br />
          <strong>Items:</strong>
          <ul>
            {order.items.map((item, index) => (
              <li key={`${item.productId || item.id || item._id}-${index}`}>
                <strong>Product ID:</strong> {item.productId || item.id || item._id} <br />
                <strong>Quantity:</strong> {item.quantity}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}