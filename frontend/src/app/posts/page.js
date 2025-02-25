"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

function PostsContent() {
    const [posts, setPosts] = useState([]);
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
        const fetchPosts = async () => {
            // setLoading(true);
            // const token = localStorage.getItem("token");

            // if (!token) {
            //     setError("Token not found, please sign in.");
            //     window.location.href = '/sign-in';
            //     setLoading(false);
            //     return;
            // }

            try {
                const response = await axios.get(`http://localhost:4000/posts?page=${currentPage}`, {
                    // headers: {
                    //     Authorization: `Bearer ${token}`,
                    // },
                });

                if (Array.isArray(response.data.data)) {
                    setPosts(response.data.data);
                    setTotalPages(response.data.totalPages);
                } else {
                    setError("Invalid response structure.");
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // window.location.href = '/sign-in';
                } else {
                    setError("Error loading posts: " + error.message);
                }
            }
            setLoading(false);
        };

        fetchPosts();
    }, [currentPage]);

    const goToPage = (newPage) => {
        setCurrentPage(newPage);
        router.push(`/posts?page=${newPage}`);
    };

    return (
        <div>
            <h1>Post List</h1>
            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : posts.length === 0 ? (
                <p>No data.</p>
            ) : (
                <ul>
                    {posts.map((post) => (

                        <li key={post._id}><br />
                            ID: {post._id} <br />
                            Title: {post.title} <br />
                            Status: {post.status} <br />
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

export default function Posts() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostsContent />
        </Suspense>
    );
}