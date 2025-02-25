"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function UserPage() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchUser = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token not found, please sign in.");
        window.location.href = '/sign-in'; 
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https//store-gyhu.vercel.app/users/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUser(response.data);
        } else {
          setError("User not found.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.href = '/sign-in';
        } else {
          setError("Error fetching user: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h1>User Details</h1>
      <ul>
      <li key={user._id}>
          <strong>ID:</strong> {user._id} <br />
          <strong>Name:</strong> {user.name} <br />
          <strong>Email:</strong> {user.email} <br />
          <strong>Phone:</strong> {user.phone} <br />
          <strong>Address:</strong> {user.address || "No address provided"} <br />
          <strong>Status:</strong> {user.status} <br />
          <strong>Loyalty Level:</strong> {user.loyalityLevel} <br />
          <strong>Role:</strong> {user.role} <br />
          <strong>Created Date:</strong> {new Date(user.created_date).toLocaleString()} <br />
        </li>
      </ul>
    </div>
  );
}
