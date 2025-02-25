"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ConversationPage() {
  const params = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchConversation = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token not found, please sign in.");
        window.location.href = '/sign-in'; 
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https//store-gyhu.vercel.app/conversations/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setConversation(response.data);
        } else {
          setError("Conversation not found.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.href = '/sign-in';
        } else {
          setError("Error fetching conversation: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!conversation) return <p>Conversation not found</p>;

  return (
    <div>
      <h1>Conversation Details</h1>
      <ul>

        <li key={conversation._id}>
          <strong>ID:</strong> {conversation._id} <br />
          <strong>lastmessage:</strong> {conversation.lastmessage} <br />
          <strong>timestamp:</strong> {conversation.timestamp} <br />
          <strong>users:</strong> {conversation.users} <br />
          
        </li>
      </ul>
    </div>
  );
}
