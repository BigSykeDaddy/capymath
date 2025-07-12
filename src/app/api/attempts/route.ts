// src/app/api/attempts/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // 1) Get the session
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "child") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse the incoming JSON — now includes `mode`
  const { problem, correct, timeMs, mode } = await request.json();

  // 3) Save it — includes `mode`
  const attempt = await prisma.attempt.create({
    data: {
      userId: session.user.id,
      problem,
      correct,
      timeMs,
      mode,
    },
  });

  // 4) Return it
  return NextResponse.json(attempt, { status: 201 });
}
