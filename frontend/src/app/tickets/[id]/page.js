"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function TicketPage() {
  const params = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchTicket = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token not found, please sign in.");
        window.location.href = '/sign-in';
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https//store-gyhu.vercel.app/tickets/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setTicket(response.data);
        } else {
          setError("Ticket not found.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.href = '/sign-in';
        } else {
          setError("Error fetching ticket: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!ticket) return <p>Ticket not found</p>;

  return (
    <div>
      <h1>Ticket Details</h1>
      <ul>
        <li key={ticket._id}>
          <strong>ID:</strong> {ticket._id} <br />
          <strong>Owner ID:</strong> {ticket.ownerId || "System"} <br />
          <strong>Order ID:</strong> {ticket.orderId} <br />
          <strong>Problem:</strong> {ticket.problem} <br />
          <strong>Status:</strong> {ticket.status} <br />
          <strong>Logs:</strong>
          <ul>
            {ticket.logs.map((log, index) => (
              <li key={index}>
                <strong>User ID:</strong> {log.userId} <br />
                <strong>Action:</strong> {log.action} <br />
                <strong>Date:</strong> {new Date(log.date_of_action).toLocaleString()}
              </li>
            ))}
          </ul>
          <strong>Comments:</strong>
          <ul>
            {ticket.comments.map((comment, index) => (
              <li key={index}>
                <strong>User ID:</strong> {comment.userId} <br />
                <strong>Comment:</strong> {comment.comments} <br />
                <strong>Date:</strong> {new Date(comment.date_of_comments).toLocaleString()}
              </li>
            ))}
          </ul>
          <strong>Attachments:</strong>
          <ul>
            {ticket.attachment.map((file, index) => (
              <li key={index}>
                <a href={file} target="_blank" rel="noopener noreferrer">
                  View Attachment {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
