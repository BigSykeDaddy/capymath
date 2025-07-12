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
          <SplashWrapper>{children}</SplashWrapper>
        </Providers>
      </body>
    </html>
  );
}
