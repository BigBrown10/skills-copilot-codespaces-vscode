'use client'

import { motion } from 'framer-motion'
import { Bot, Plus, MoreVertical, Power, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BotsPage() {
  const bots = [
    {
      id: 1,
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries and support tickets',
      channel: 'WhatsApp',
      status: 'active',
      conversations: 234,
      successRate: '96%',
    },
    {
      id: 2,
      name: 'Booking Bot',
      description: 'Manages appointments and reservations',
      channel: 'Telegram',
      status: 'active',
      conversations: 189,
      successRate: '94%',
    },
    {
      id: 3,
      name: 'Sales Assistant',
      description: 'Helps customers with product selection',
      channel: 'WhatsApp',
      status: 'inactive',
      conversations: 156,
      successRate: '92%',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Bots</h1>
          <p className="text-gray-400">Manage your AI chatbots and their configurations</p>
        </div>
        <Button className="bg-primary hover:bg-primary-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Bot
        </Button>
      </motion.div>

      {/* Bots Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot, index) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="glass-dark backdrop-blur-xl border-white/10 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{bot.name}</CardTitle>
                      <span className="text-xs text-gray-400">{bot.channel}</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">{bot.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-400">Conversations</p>
                    <p className="text-lg font-semibold text-white">{bot.conversations}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Success Rate</p>
                    <p className="text-lg font-semibold text-white">{bot.successRate}</p>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      bot.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    {bot.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add New Bot Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: bots.length * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="glass-dark backdrop-blur-xl border-white/10 border-dashed cursor-pointer hover:border-primary/50 transition-colors h-full">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Create New Bot</h3>
              <p className="text-sm text-gray-400 text-center">
                Deploy a new AI agent for WhatsApp or Telegram
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
