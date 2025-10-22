'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'

export default function AnalyticsPage() {
  const stats = [
    {
      title: 'Total Conversations',
      value: '24,563',
      change: '+12.5%',
      trend: 'up' as const,
      icon: BarChart3,
    },
    {
      title: 'Avg. Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'up' as const,
      icon: Clock,
    },
    {
      title: 'Active Users',
      value: '4,892',
      change: '+23.1%',
      trend: 'up' as const,
      icon: Users,
    },
    {
      title: 'Conversion Rate',
      value: '32.4%',
      change: '+5.2%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
  ]

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    conversations: Math.floor(Math.random() * 100) + 50,
  }))

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Detailed insights into your chatbot performance</p>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Conversations Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Conversations Over Time</h2>
          <div className="h-64 flex items-end justify-between gap-1">
            {hourlyData.map((data) => (
              <motion.div
                key={data.hour}
                initial={{ height: 0 }}
                animate={{ height: `${(data.conversations / 150) * 100}%` }}
                transition={{ delay: 0.5 + data.hour * 0.02 }}
                className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                title={`${data.hour}:00 - ${data.conversations} chats`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-gray-500 text-xs">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
          </div>
        </motion.div>

        {/* Top Intents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Top Intents</h2>
          <div className="space-y-4">
            {[
              { intent: 'Booking Request', count: 1234, percentage: 35 },
              { intent: 'Product Inquiry', count: 987, percentage: 28 },
              { intent: 'Support Ticket', count: 756, percentage: 21 },
              { intent: 'General Question', count: 432, percentage: 12 },
              { intent: 'Feedback', count: 145, percentage: 4 },
            ].map((item, index) => (
              <div key={item.intent} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{item.intent}</span>
                  <span className="text-gray-400 text-sm">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-primary-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Platform Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-6">Platform Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { platform: 'WhatsApp', conversations: 15234, percentage: 62, color: 'from-green-500 to-green-600' },
            { platform: 'Telegram', conversations: 8329, percentage: 34, color: 'from-blue-500 to-blue-600' },
            { platform: 'Web Chat', conversations: 1000, percentage: 4, color: 'from-purple-500 to-purple-600' },
          ].map((item) => (
            <div key={item.platform} className="glass-dark p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{item.platform}</h3>
                <span className="text-2xl font-bold text-white">{item.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-primary-800 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${item.color}`}
                />
              </div>
              <p className="text-gray-400 text-sm">{item.conversations.toLocaleString()} conversations</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
