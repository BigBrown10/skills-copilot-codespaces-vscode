import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'B2B Chatbot Platform - AI Agents for WhatsApp & Telegram',
  description: 'Create human-like AI agents on WhatsApp and Telegram for bookings, appointments, and customer support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-secondary via-primary-900 to-secondary min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
