// components/AuthButton.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"; // if you have a button component

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Button disabled>Loading…</Button>;
  }

  if (!session) {
    return (
      <Button onClick={() => signIn("credentials")}>
        Sign In
      </Button>
    );
  }

  return (
    <Button onClick={() => signOut()}>
      Sign Out ({session.user.email})
    </Button>
  );
}
