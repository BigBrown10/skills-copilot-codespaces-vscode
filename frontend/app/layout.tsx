import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'AI Chatbot Platform - Automate WhatsApp & Telegram',
  description: 'Create human-like AI agents for WhatsApp and Telegram. Automate bookings, appointments, and customer support with advanced AI technology.',
  keywords: ['AI chatbot', 'WhatsApp automation', 'Telegram bot', 'customer support', 'appointment booking'],
  authors: [{ name: 'Chatbot Platform' }],
  openGraph: {
    title: 'AI Chatbot Platform',
    description: 'Automate customer interactions with AI-powered chatbots',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0F1F3A] to-[#0A1628]">
        {children}
      </body>
    </html>
  )
}
