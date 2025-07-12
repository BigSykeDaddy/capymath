/// <reference types="next-auth" />

import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: "parent" | "child"
      parentId?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    passwordHash?: string | null
    role: "parent" | "child"
    parentId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "parent" | "child"
    parentId?: string
  }
}
