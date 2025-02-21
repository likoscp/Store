"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            console.log("Token retrieved:", token);


            if (!token) {
                setError("Token not found, please sign in.");
                window.location.href = '/sign-in';
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem("token");

                const response = await axios.get("http://localhost:4000/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                if (Array.isArray(response.data.data)) {
                    setOrders(response.data.data);
                } else {
                    setError("Invalid response structure.");
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    window.location.href = '/sign-in';
                } else {
                    setError("Error loading orders: " + error.message);
                }
            }
            setLoading(false);
        };

        fetchOrders();
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
                        <li key={order._id}>ID: {order._id} - Status: {order.status}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
