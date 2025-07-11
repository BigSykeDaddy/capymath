// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// You MUST name this file `route.ts` inside an `[...nextauth]` folder:
// src/app/api/auth/[...nextauth]/route.ts
export { authOptions };
export default NextAuth(authOptions);
