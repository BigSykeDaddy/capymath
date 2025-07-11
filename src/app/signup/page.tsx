"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "parent" }),
    });
    if (res.ok) {
      router.push("/api/auth/signin");
    } else {
      const { error: msg } = await res.json();
      setError(msg || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl mb-4">Sign Up</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block">Email</label>
          <input
            name="email"
            type="email"
            onChange={onChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            name="password"
            type="password"
            onChange={onChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Name (optional)</label>
          <input
            name="name"
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
