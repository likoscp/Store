"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/Auth/sign-in", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            console.log("Token saved:", response.data.token);


            router.push("/orders");
        } catch (err) {
            setError("Invalid data!");
            console.error("Error sign-in:", err);
        }
    };

    return (
        <div style={{ width: "300px", margin: "0 auto", padding: "20px" }}>
            <h2>Войти</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
