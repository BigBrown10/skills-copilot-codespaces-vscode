'use client'

import { motion } from 'framer-motion'
import { StatsCard } from '@/components/dashboard/stats-card'
import { MessageSquare, Users, TrendingUp, Bot } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Conversations',
      value: '12,543',
      change: '+12.5%',
      trend: 'up' as const,
      icon: MessageSquare,
    },
    {
      title: 'Active Bots',
      value: '8',
      change: '+2',
      trend: 'up' as const,
      icon: Bot,
    },
    {
      title: 'Total Users',
      value: '2,847',
      change: '+18.2%',
      trend: 'up' as const,
      icon: Users,
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.3%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
  ]

  const recentConversations = [
    { id: 1, user: 'John Doe', message: 'I need to book an appointment', time: '2 minutes ago', status: 'active' },
    { id: 2, user: 'Jane Smith', message: 'What are your business hours?', time: '15 minutes ago', status: 'completed' },
    { id: 3, user: 'Bob Johnson', message: 'Help with my order #12345', time: '1 hour ago', status: 'completed' },
    { id: 4, user: 'Alice Williams', message: 'Pricing information needed', time: '2 hours ago', status: 'active' },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your bots.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Conversations</h2>
          <div className="space-y-4">
            {recentConversations.map((conversation) => (
              <div key={conversation.id} className="flex items-start gap-4 p-4 glass-dark rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {conversation.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-semibold truncate">{conversation.user}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      conversation.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {conversation.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{conversation.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{conversation.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bot Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Bot Performance</h2>
          <div className="space-y-4">
            {[
              { name: 'Customer Support Bot', performance: 95, conversations: 3421 },
              { name: 'Booking Assistant', performance: 92, conversations: 2134 },
              { name: 'FAQ Bot', performance: 98, conversations: 5678 },
              { name: 'Sales Assistant', performance: 89, conversations: 1290 },
            ].map((bot) => (
              <div key={bot.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{bot.name}</span>
                  <span className="text-gray-400 text-sm">{bot.conversations} chats</span>
                </div>
                <div className="w-full h-2 bg-primary-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bot.performance}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Success Rate</span>
                  <span className="text-green-400 font-semibold">{bot.performance}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
