'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Bot, 
  BarChart3, 
  Settings, 
  LogOut,
  MessageSquare 
} from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chatbots', href: '/dashboard/bots', icon: Bot },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 glass-effect border-r border-white/10 p-6"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
          AI Chatbot
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass-effect rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@example.com</p>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  )
}
