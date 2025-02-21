"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isClient, setIsClient] = useState(false); 

    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found, please sign in.");
                window.location.href = '/sign-in';
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/orders?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data.data)) {
                    setOrders(response.data.data);
                    setTotalPages(response.data.totalPages);
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

        if (isClient) {
            fetchOrders(); 
        }
    }, [currentPage, isClient]);

    const goToPage = (newPage) => {
        setCurrentPage(newPage); 
        router.push(`/orders?page=${newPage}`);
    };

    if (!isClient) {
        return null;
    }

    return (
        <div>
            <h1>Order List</h1>
            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No data.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id}>ID: {order._id} - Status: {order.status}</li>
                    ))}
                </ul>
            )}

            <div>
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
