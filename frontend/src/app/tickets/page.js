"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

function TicketsContent() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const pageFromUrl = searchParams.get("page");
        if (pageFromUrl) {
            setCurrentPage(Number(pageFromUrl));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found, please sign in.");
                window.location.href = '/sign-in';
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https//store-gyhu.vercel.app/tickets?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data.data)) {
                    setTickets(response.data.data);
                    setTotalPages(response.data.totalPages);
                } else {
                    setError("Invalid response structure.");
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    window.location.href = '/sign-in';
                } else {
                    setError("Error loading tickets: " + error.message);
                }
            }
            setLoading(false);
        };

        fetchTickets();
    }, [currentPage]);

    const goToPage = (newPage) => {
        setCurrentPage(newPage);
        router.push(`/tickets?page=${newPage}`);
    };

    return (
        <div>
            <h1>Ticket List</h1>
            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : tickets.length === 0 ? (
                <p>No data.</p>
            ) : (
                <ul>
                    {tickets.map((ticket) => (
                        <li key={ticket._id}>
                        <strong>ID:</strong> {ticket._id} <br />
                        <strong>Owner ID:</strong> {ticket.ownerId || "System"} <br />
                        <strong>Status:</strong> {ticket.status} <br />
                      </li>
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

export default function Tickets() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TicketsContent />
        </Suspense>
    );
}