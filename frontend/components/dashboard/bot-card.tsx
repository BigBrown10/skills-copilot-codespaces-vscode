'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Settings, Trash2 } from 'lucide-react'
import clsx from 'clsx'

interface BotCardProps {
  bot: {
    id: string
    name: string
    platform: 'whatsapp' | 'telegram'
    isActive: boolean
    conversations: number
    responseRate: number
  }
}

export default function BotCard({ bot }: BotCardProps) {
  const platformColors = {
    whatsapp: 'bg-green-500/20 text-green-400',
    telegram: 'bg-blue-500/20 text-blue-400',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
            <span className={clsx(
              'text-xs px-2 py-1 rounded capitalize',
              platformColors[bot.platform]
            )}>
              {bot.platform}
            </span>
          </div>
        </div>

        <div className={clsx(
          'w-3 h-3 rounded-full',
          bot.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
        )} />
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Conversations</span>
          <span className="text-sm font-semibold text-white">
            {bot.conversations.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Response Rate</span>
          <span className="text-sm font-semibold text-white">
            {bot.responseRate}%
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Configure</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
