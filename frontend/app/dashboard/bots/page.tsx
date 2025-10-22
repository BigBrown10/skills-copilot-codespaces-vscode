'use client'

import { motion } from 'framer-motion'
import { BotCard } from '@/components/dashboard/bot-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function BotsPage() {
  const [bots] = useState([
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries and support tickets',
      platform: 'whatsapp' as const,
      status: 'active' as const,
      conversations: 3421,
      successRate: 95,
    },
    {
      id: '2',
      name: 'Booking Assistant',
      description: 'Manages appointment bookings and scheduling',
      platform: 'telegram' as const,
      status: 'active' as const,
      conversations: 2134,
      successRate: 92,
    },
    {
      id: '3',
      name: 'FAQ Bot',
      description: 'Answers frequently asked questions automatically',
      platform: 'whatsapp' as const,
      status: 'active' as const,
      conversations: 5678,
      successRate: 98,
    },
    {
      id: '4',
      name: 'Sales Assistant',
      description: 'Helps with product information and sales',
      platform: 'telegram' as const,
      status: 'inactive' as const,
      conversations: 1290,
      successRate: 89,
    },
  ])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Bots</h1>
          <p className="text-gray-400">Manage and monitor your AI chatbots</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Bot
        </Button>
      </motion.div>

      {/* Bot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot, index) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BotCard {...bot} />
          </motion.div>
        ))}

        {/* Create New Bot Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: bots.length * 0.1 }}
          className="glass p-8 rounded-2xl flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:bg-white/10 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
            <Plus className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Create New Bot</h3>
          <p className="text-gray-400 text-center">
            Set up a new AI chatbot in minutes
          </p>
        </motion.div>
      </div>
    </div>
  )
}
