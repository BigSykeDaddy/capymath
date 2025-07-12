// src/components/ui/AuthButton.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-lg bg-[#FF7F66] bg-opacity-50 text-white cursor-not-allowed"
      >
        Loading…
      </button>
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="px-4 py-2 rounded-lg bg-[#FF7F66] hover:bg-[#F65A46] text-white transition"
      >
        Sign In
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 rounded-lg bg-[#FF7F66] hover:bg-[#F65A46] text-white transition"
    >
      Sign Out
    </button>
  );
}
