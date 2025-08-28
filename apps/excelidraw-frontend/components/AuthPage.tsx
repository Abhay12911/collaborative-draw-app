"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "../config";

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = isSignin ? "/signin" : "/signup";
            const body = isSignin 
                ? { username: email, password }
                : { username: email, password, name };

            const response = await fetch(`${HTTP_BACKEND}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                if (isSignin) {
                    // Store token in localStorage only on signin
                    localStorage.setItem("authToken", data.token);
                    // Redirect to home page after signin
                    router.push("/");
                } else {
                    // Redirect to signin after signup
                    router.push("/signin");
                }
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isSignin ? "Sign In" : "Sign Up"}
                </h1>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isSignin && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? "Loading..." : (isSignin ? "Sign In" : "Sign Up")}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {isSignin ? "Don't have an account? " : "Already have an account? "}
                        <a
                            href={isSignin ? "/signup" : "/signin"}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            {isSignin ? "Sign Up" : "Sign In"}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}