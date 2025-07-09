// src/app/layout.tsx
import './globals.css'
import SplashWrapper from '../components/SplashWrapper'
import Nav from '@/components/Nav'

export const metadata = {
  title: 'CapyMath',
  description: 'Capybara-themed multiplication drills with adaptive quizzes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen relative">
        <Nav />
        <SplashWrapper>
          {children}
        </SplashWrapper>
      </body>
    </html>
  )
}
