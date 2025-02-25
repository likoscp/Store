"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

function ConversationsContent() {
    const [conversations, setConversations] = useState([]);
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
        const fetchConversations = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found, please sign in.");
                window.location.href = '/sign-in';
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://store-gyhu.vercel.app/conversations?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data.data)) {
                    setConversations(response.data.data);
                    setTotalPages(response.data.totalPages);
                } else {
                    setError("Invalid response structure.");
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    window.location.href = '/sign-in';
                } else {
                    setError("Error loading conversations: " + error.message);
                }
            }
            setLoading(false);
        };

        fetchConversations();
    }, [currentPage]);

    const goToPage = (newPage) => {
        setCurrentPage(newPage);
        router.push(`/conversations?page=${newPage}`);
    };

    return (
        <div>
            <h1>Conversation List</h1>
            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : conversations.length === 0 ? (
                <p>No data.</p>
            ) : (
                <ul>
                    {conversations.map((conversation) => (
                        <li key={conversation._id}>
                        <strong>ID:</strong> {conversation._id} <br />
                        <strong>users:</strong> {conversation.users} <br />
                        
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

export default function Conversations() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConversationsContent />
        </Suspense>
    );
}