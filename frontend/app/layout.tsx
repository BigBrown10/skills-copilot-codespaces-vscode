import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'B2B Chatbot Platform - AI-Powered Business Automation',
  description: 'Create intelligent AI agents for WhatsApp and Telegram to automate bookings, appointments, and customer support',
  keywords: ['chatbot', 'AI', 'WhatsApp', 'Telegram', 'automation', 'B2B', 'SaaS'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
