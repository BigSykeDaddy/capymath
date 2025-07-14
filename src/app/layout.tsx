// src/app/layout.tsx
import "./globals.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Providers } from "./providers";
import Nav from "@/components/Nav";
import SplashWrapper from "@/components/SplashWrapper";

export const metadata = {
  title: "CapyMath",
  description: "Capybara-themed multiplication drills with adaptive quizzes",
  viewport: "width=device-width, initial-scale=1",   // ← ensures mobile scales to viewport
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="min-h-screen relative">
        <Providers session={session ?? undefined}>
          <Nav />
          <div className="h-20" /> {/* Spacer for fixed nav */}
          <SplashWrapper>{children}</SplashWrapper>
        </Providers>
      </body>
    </html>
  );
}
