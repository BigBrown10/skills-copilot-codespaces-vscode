'use client'

import { SessionProvider } from 'next-auth/react'
import Sidebar from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  )
}
