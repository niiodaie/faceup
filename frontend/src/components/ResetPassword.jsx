import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // POST to backend endpoint for sending reset email
    const response = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("✅ Reset link sent! Check your inbox.");
    } else {
      setMessage(data.error || "❌ Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="text-sm mt-4 text-center text-purple-600">{message}</p>
        )}
      </div>
    </div>
  );
}
