'use client'

import { motion } from 'framer-motion'
import { Bot, MessageSquare, TrendingUp, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BotCardProps {
  id: string
  name: string
  description: string
  platform: 'whatsapp' | 'telegram'
  status: 'active' | 'inactive'
  conversations: number
  successRate: number
}

export function BotCard({ 
  name, 
  description, 
  platform, 
  status, 
  conversations, 
  successRate 
}: BotCardProps) {
  return (
    <div className="glass p-6 rounded-2xl card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            platform === 'whatsapp' ? 'bg-green-600/20' : 'bg-blue-600/20'
          }`}>
            <Bot className={`w-6 h-6 ${
              platform === 'whatsapp' ? 'text-green-400' : 'text-blue-400'
            }`} />
          </div>
          <div>
            <h3 className="text-white font-bold">{name}</h3>
            <p className={`text-xs font-semibold ${
              status === 'active' ? 'text-green-400' : 'text-gray-400'
            }`}>
              {status === 'active' ? '● Active' : '● Inactive'}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-6">{description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <MessageSquare className="w-4 h-4" />
          <span>{conversations.toLocaleString()} conversations</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Success Rate</span>
          <span className="text-white font-semibold">{successRate}%</span>
        </div>
        <div className="w-full h-2 bg-primary-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${successRate}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1 text-sm">
          Configure
        </Button>
        <Button variant="ghost" className="flex-1 text-sm">
          View Stats
        </Button>
      </div>
    </div>
  )
}
