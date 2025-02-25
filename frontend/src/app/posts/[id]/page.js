"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`https//store-gyhu.vercel.app/posts/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      <h1>Post Details</h1>
      <ul>
        <li key={post._id}>
          <strong>ID:</strong> {post._id} <br />
          <strong>Title:</strong> {post.title} <br />
          <strong>Content:</strong> {post.content} <br />
          <strong>Main Image:</strong> <br />
          <img src={post.mainImage} alt={post.title} width="200" /> <br />
          <strong>Creator ID:</strong> {post.creatorId} <br />
          <strong>Status:</strong> {post.status} <br />
          <strong>Created Date:</strong> {new Date(post.created_date).toLocaleString()} <br />
          <strong>Additional Images:</strong>
          <ul>
            {post.images.map((image, index) => (
              <li key={index}>
                <img src={image} alt={`Image ${index + 1}`} width="150" />
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
