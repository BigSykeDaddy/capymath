// src/app/api/auth/resend/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.emailVerified) {
            // Do not leak info about whether the email is registered or verified
            return NextResponse.json({ success: true });
        }

        const newToken = randomUUID();
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: newToken,
                verificationTokenExpires: expires,
            },
        });

        const verifyUrl = `https://www.capymath.com/verify?token=${newToken}`;

        await resend.emails.send({
            from: 'CapyMath <auth@capymath.com>',
            to: email,
            subject: 'Your new CapyMath verification link',
            html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Here’s your new verification link</h2>
          <p>Click below to verify your account:</p>
          <a href="${verifyUrl}" style="color:#2563EB;" target="_blank">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Resend verification error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
