'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import BotCard from '@/components/dashboard/bot-card'
import Button from '@/components/ui/button'

export default function BotsPage() {
  const [bots, setBots] = useState([
    {
      id: '1',
      name: 'Customer Support Bot',
      platform: 'whatsapp' as const,
      isActive: true,
      conversations: 234,
      responseRate: 98.5,
    },
    {
      id: '2',
      name: 'Booking Assistant',
      platform: 'telegram' as const,
      isActive: true,
      conversations: 156,
      responseRate: 97.2,
    },
    {
      id: '3',
      name: 'Sales Bot',
      platform: 'whatsapp' as const,
      isActive: false,
      conversations: 89,
      responseRate: 95.8,
    },
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
            Chatbots
          </h1>
          <p className="text-gray-400">Manage your AI chatbots and their configurations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
            Create Bot
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot, index) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BotCard bot={bot} />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {bots.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card text-center py-16"
        >
          <h3 className="text-2xl font-semibold text-white mb-4">
            No bots yet
          </h3>
          <p className="text-gray-400 mb-8">
            Create your first chatbot to get started
          </p>
          <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
            Create Your First Bot
          </Button>
        </motion.div>
      )}
    </div>
  )
}
