// src/components/Nav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/ui/AuthButton";

export default function Nav() {
  // (we’re no longer hiding on "/")
  return (
    <header className="fixed top-4 left-4 z-50 flex items-center space-x-4">
      {/* logo */}
      <Link href="/" aria-label="Go to main menu">
        <Image
          src="/images/capy-face.png"
          alt="Capybara"
          width={48}
          height={48}
          className="cursor-pointer animate-capy-pop"
        />
      </Link>

      {/* sign in / sign out */}
      <AuthButton />
    </header>
  );
}
