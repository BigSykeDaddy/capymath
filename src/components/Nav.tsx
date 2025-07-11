// src/components/Nav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AuthButton } from "@/components/ui/AuthButton";

export default function Nav() {
  const path = usePathname();
  if (path === "/") return null;

  return (
    <header className="fixed top-4 left-4 z-50 flex items-center space-x-4">
      <Link href="/" aria-label="Go to main menu">
        <Image
          src="/images/capy-face.png"
          alt="Capybara"
          width={48}
          height={48}
          className="cursor-pointer animate-capy-pop"
        />
      </Link>

      <Link href="/signup">
        <a className="px-2 py-1 border rounded hover:bg-gray-100">Sign Up</a>
      </Link>

      <AuthButton />
    </header>
  );
}
