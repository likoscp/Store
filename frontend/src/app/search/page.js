"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from 'jwt-decode';

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
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
    const minPriceFromUrl = searchParams.get("minPrice");
    const maxPriceFromUrl = searchParams.get("maxPrice");
    const tagsFromUrl = searchParams.get("tags");

    if (pageFromUrl) setCurrentPage(Number(pageFromUrl));
    if (searchQueryFromUrl)
      setFilter((prev) => ({ ...prev, searchQuery: searchQueryFromUrl }));
    if (categoryFromUrl)
      setFilter((prev) => ({ ...prev, category: categoryFromUrl }));
    if (minPriceFromUrl && maxPriceFromUrl)
      setFilter((prev) => ({
        ...prev,
        priceRange: [Number(minPriceFromUrl), Number(maxPriceFromUrl)],
      }));
    if (tagsFromUrl)
      setFilter((prev) => ({ ...prev, tags: tagsFromUrl.split(",") }));
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/filter`, {
          params: {
            page: currentPage,
            name: filter.searchQuery,
            category: filter.category,
            minPrice: filter.priceRange[0],
            maxPrice: filter.priceRange[1],
            tags: filter.tags.join(","),
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

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, filter, token]);

  const goToPage = (newPage) => {
    setCurrentPage(newPage);
    router.push(
      `/search?page=${newPage}&search=${filter.searchQuery}&category=${filter.category}&minPrice=${filter.priceRange[0]}&maxPrice=${filter.priceRange[1]}&tags=${filter.tags.join(",")}`
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);

    router.push(
      `/search?page=1&search=${filter.searchQuery}&category=${filter.category}&minPrice=${filter.priceRange[0]}&maxPrice=${filter.priceRange[1]}&tags=${filter.tags.join(",")}`
    );
  };

  const handleTagChange = (tag) => {
    setFilter((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
    setCurrentPage(1);

    router.push(
      `/search?page=1&search=${filter.searchQuery}&category=${filter.category}&minPrice=${filter.priceRange[0]}&maxPrice=${filter.priceRange[1]}&tags=${filter.tags.join(",")}`
    );
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };


  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add products to your cart');
      return;
    }

    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    const userId = decodedToken.id;

    if (!userId) {
      alert('User ID not found in token');
      return;
    }

    const quantity = quantities[productId] || 1;

    try {
      const response = await fetch(`http://localhost:4000/orders/userstatus/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pendingOrder = await response.json();

      if (pendingOrder.length > 0) {
        const orderId = pendingOrder[0]._id;

        const existingItem = pendingOrder[0].items.find(item => item.productId === productId);

        let updatedItems;
        if (existingItem) {

          updatedItems = pendingOrder[0].items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          );
        }
        else {

          updatedItems = [...pendingOrder[0].items, { productId, quantity }];
        }

        const updatedOrder = { items: updatedItems };

        const updateResponse = await fetch(`http://localhost:4000/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedOrder),
        });

        const result = await updateResponse.json();
        console.log('Order updated:', result);
      } else {

        const newOrder = {
          userId,
          items: [{ productId, quantity }],
          status: 'pending'
        };

        const createResponse = await fetch('http://localhost:4000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newOrder),
        });

        const result = await createResponse.json();
        console.log('Order created:', result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-4">Search Products</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 mb-6 mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
        <div className="space-y-4">
          <input
            type="text"
            name="searchQuery"
            placeholder="Search by name..."
            value={filter.searchQuery}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          <select
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Movies">Movies</option>
            <option value="Home">Home</option>
            <option value="Books">Books</option>
          </select>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Price Range: ${filter.priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={filter.priceRange[1]}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)],
                }))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags:
            </label>
            <div className="flex flex-wrap gap-2">
              {["Incredible", "Small", "Fantasy", "Adventure"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagChange(tag)}
                  className={`px-3 py-1 text-sm font-medium rounded-full ${filter.tags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No data.</p>
      ) : (
        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
              >
                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                  <div className="flex items-center justify-between md:order-3 md:justify-end">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            Math.max(1, quantities[product._id] - 1 || 1)
                          )
                        }
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                      >
                        <svg
                          className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 2"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h16"
                          />
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={quantities[product._id] || 1}
                        readOnly
                        className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            (quantities[product._id] || 1) + 1
                          )
                        }
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                      >
                        <svg
                          className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 18"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 1v16M1 9h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="text-end md:order-4 md:w-32">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        ${(product.price * (quantities[product._id] || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                    <a
                      href={`/products/${product._id}`}
                      className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      <b>{product.name}</b>
                    </a><br></br>
                    <a
                      href={`/search?page=1&search=&category=&minPrice=&maxPrice=&tags=${product.tags.join(",")}`}
                      className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      {product.tags.join(", ")}
                    </a>
                    <br></br>
                    <a
                      href={`/search?page=1&search=&category=${product.category}&minPrice=&maxPrice=&tags=`}
                      className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      {product.category}
                    </a><br></br>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product._id)}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                      >
                        <svg
                          className="me-1.5 h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                          />
                        </svg>
                        Add to Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFromCart(product._id)}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                      >
                        <svg
                          className="me-1.5 h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18 17.94 6M18 18 6.06 6"
                          />
                        </svg>
                        Delete from Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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