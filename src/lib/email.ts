// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `https://capymath.com/verify?token=${token}`

  await resend.emails.send({
    from: 'CapyMath <signup@capymath.com>',
    to,
    subject: 'Verify your email for CapyMath',
    html: `
      <div style="font-family: sans-serif; padding: 1rem;">
        <h2>Welcome to CapyMath!</h2>
        <p>Thanks for signing up. Please verify your email by clicking below:</p>
        <p><a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a></p>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${verifyUrl}</p>
      </div>
    `,
    text: `Welcome to CapyMath!\n\nPlease verify your email by visiting: ${verifyUrl}`,
  })
}
