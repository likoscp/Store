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
    const [filters, setFilters] = useState({
        searchQuery: "",
        category: "",
        priceRange: [0, 1000],
        tags: [],
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const pageFromUrl = searchParams.get("page");
        const searchQueryFromUrl = searchParams.get("search");
        const categoryFromUrl = searchParams.get("category");

        if (pageFromUrl) setCurrentPage(Number(pageFromUrl));
        if (searchQueryFromUrl) setFilters((prev) => ({ ...prev, searchQuery: searchQueryFromUrl }));
        if (categoryFromUrl) setFilters((prev) => ({ ...prev, category: categoryFromUrl }));
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
                const response = await axios.get(`http://localhost:4000/products`, {
                    //поменять на серч, сейчас заглушка стоит
                    params: {
                        page: currentPage,
                        search: filters.searchQuery,
                        category: filters.category,
                        minPrice: filters.priceRange[0],
                        maxPrice: filters.priceRange[1],
                        tags: filters.tags.join(","),
                    },
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
    }, [currentPage, filters]);

    const goToPage = (newPage) => {
        setCurrentPage(newPage);
        router.push(`/products?page=${newPage}&search=${filters.searchQuery}&category=${filters.category}`);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleTagChange = (tag) => {
        setFilters((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag)
                : [...prev.tags, tag],
        }));
        setCurrentPage(1); 
    };

    return (
        <div>
            <h1>Search</h1>

            <div>
                <input
                    type="text"
                    name="searchQuery"
                    placeholder="Search by name..."
                    value={filters.searchQuery}
                    onChange={handleFilterChange}
                />
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                >
                    <option value="">All Categories</option>
                    {/* поменять категории потом, мб через гет олл категории */}
                    <option value="Movies">Movies</option>
                    <option value="Home">Home</option>
                    <option value="Books">Books</option>
                </select>
                <div>
                    <label>Price Range:</label>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                priceRange: [prev.priceRange[0], Number(e.target.value)],
                            }))
                        }
                    />
                    <span>${filters.priceRange[1]}</span>
                </div>
                <div>
                    <label>Tags:</label>
                    {["Incredible", "Small", "Fantasy", "Adventure"].map((tag) => (
                        <label key={tag}>
                            <input
                                type="checkbox"
                                checked={filters.tags.includes(tag)}
                                onChange={() => handleTagChange(tag)}
                            />
                            {tag}
                        </label>
                    ))}
                </div>
            </div>

            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No data.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>
                            <br />
                            ID: {product._id} <br />
                            Name: {product.name} <br />
                            Price: ${product.price.toFixed(2)} <br />
                            Category: {product.category} <br />
                            Tags: {product.tags.join(", ")} <br />
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