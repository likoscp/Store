"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4000/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h1>Product Details</h1>
      <ul>
        <li key={product._id}>
          ID: {product._id} <br />
          Name: {product.name} <br />
          Price: {product.price} <br />
          Stock: {product.stock} <br />
          Category: {product.category} <br />
          Tags: {product.tags.length > 0 ? product.tags.join(", ") : "None"} <br />
          Description: {product.description}
        </li>
      </ul>
    </div>
  );
}
