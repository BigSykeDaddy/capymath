// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email + Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (
          user &&
          user.passwordHash &&
          (await bcrypt.compare(credentials.password, user.passwordHash))
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // when the user signs in, persist their role & parentId on the JWT
      if (user) {
        token.role = user.role;
        token.parentId = user.parentId ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      // expose id, role, parentId on the session.user
      session.user.id = token.sub!;
      session.user.role = token.role as "parent" | "child";
      session.user.parentId = token.parentId as string | undefined;
      return session;
    },
  },
};
