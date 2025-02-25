"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

function ProductsContent() {
    const [products, setProducts] = useState([]);
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
        const fetchProducts = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found, please sign in.");
                window.location.href = '/sign-in';
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https//store-gyhu.vercel.app/products?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data.data)) {
                    setProducts(response.data.data);
                    setTotalPages(response.data.totalPages);
                } else {
                    setError("Invalid response structure.");
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    window.location.href = '/sign-in';
                } else {
                    setError("Error loading products: " + error.message);
                }
            }
            setLoading(false);
        };

        fetchProducts();
    }, [currentPage]);

    const goToPage = (newPage) => {
        setCurrentPage(newPage);
        router.push(`/products?page=${newPage}`);
    };

    return (
        <div>
            <h1>Product List</h1>
            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No data.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        
                        <li key={product._id}><br />
                        ID: {product._id} <br />
                        Name: {product.name} <br />
                        Price: {product.price} <br />
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

export default function Products() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}