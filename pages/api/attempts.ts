import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const session = await getSession({ req });
  if (!session || session.user.role !== "child") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { problem, correct, timeMs } = req.body;
  const attempt = await prisma.attempt.create({
    data: {
      userId: session.user.id,
      problem,
      correct,
      timeMs,
    },
  });
  res.status(201).json(attempt);
}
