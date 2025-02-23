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
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const pageFromUrl = searchParams.get("page");
    const searchQueryFromUrl = searchParams.get("search");
    const categoryFromUrl = searchParams.get("category");

    if (pageFromUrl) setCurrentPage(Number(pageFromUrl));
    if (searchQueryFromUrl)
      setFilters((prev) => ({ ...prev, searchQuery: searchQueryFromUrl }));
    if (categoryFromUrl)
      setFilters((prev) => ({ ...prev, category: categoryFromUrl }));
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/filters`, {
          params: {
            page: currentPage,
            search: filters.searchQuery,
            category: filters.category,
            minPrice: filters.priceRange[0],
            maxPrice: filters.priceRange[1],
            tags: filters.tags.join(","),
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          setTotalPages(response.data.totalPages);
        } else {
          setError("Invalid response structure.");
        }
      } catch (error) {
        setError("Error loading products: " + error.message);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [currentPage, filters, token]);

  const goToPage = (newPage) => {
    setCurrentPage(newPage);
    router.push(
      `/search?page=${newPage}&tags=${filters.tags}&category=${filters.category}`
    );
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

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleAddToCart = (productId) => {
    const quantity = quantities[productId] || 1;
    console.log(`Added product ${productId} to cart with quantity ${quantity}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-4">Search Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="searchQuery"
          placeholder="Search by name..."
          value={filters.searchQuery}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          <option value="Movies">Movies</option>
          <option value="Home">Home</option>
          <option value="Books">Books</option>
        </select>
        <div className="flex flex-col">
          <label className="mb-2">Price Range: ${filters.priceRange[1]}</label>
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
            className="w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2">Tags:</label>
          <div className="flex flex-wrap gap-2">
            {["Incredible", "Small", "Fantasy", "Adventure"].map((tag) => (
              <label key={tag} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No data.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product._id}
              className="p-4 border border-gray-200 rounded-lg shadow"
            >
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {product._id}
                </p>
                <p>
                  <strong>Name:</strong> {product.name}
                </p>
                <p>
                  <strong>Price:</strong> ${product.price.toFixed(2)}
                </p>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>
                  <strong>Tags:</strong> {product.tags.join(", ")}
                </p>
                {token && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quantities[product._id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          product._id,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-20 p-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 mx-1 border rounded bg-blue-500 text-white disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 mx-1 border rounded bg-blue-500 text-white disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
