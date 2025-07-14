// src/app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, name, and password required' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = randomUUID();
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'child',
        verificationToken,
        verificationTokenExpires: tokenExpires,
        emailVerified: null,
      },
    });

    const verifyUrl = `https://www.capymath.com/verify?token=${verificationToken}`;

    await resend.emails.send({
      from: 'CapyMath <auth@capymath.com>', // must match verified domain in Resend
      to: email,
      subject: 'Verify your CapyMath account',
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Welcome to CapyMath, ${name}!</h2>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verifyUrl}" target="_blank" style="color: #2563EB;">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    console.error('Sign-up error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
