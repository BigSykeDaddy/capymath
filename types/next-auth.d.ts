/// <reference types="next-auth" />

import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: "parent" | "child"
      parentId?: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    role: "parent" | "child"
    parentId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "parent" | "child"
    parentId?: string | null
  }
}
