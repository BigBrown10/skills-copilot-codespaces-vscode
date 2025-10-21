'use client'

import { motion } from 'framer-motion'
import { Bot, MessageSquare, Users, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Bots',
      value: '12',
      change: '+2 new',
      icon: Bot,
    },
    {
      title: 'Conversations',
      value: '1,234',
      change: '+18%',
      icon: MessageSquare,
    },
    {
      title: 'Active Users',
      value: '856',
      change: '+12%',
      icon: Users,
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.4%',
      icon: TrendingUp,
    },
  ]

  const recentConversations = [
    { id: 1, user: 'Alice Johnson', bot: 'Support Bot', time: '2 min ago', status: 'active' },
    { id: 2, user: 'Bob Smith', bot: 'Booking Bot', time: '5 min ago', status: 'completed' },
    { id: 3, user: 'Carol White', bot: 'Support Bot', time: '10 min ago', status: 'active' },
    { id: 4, user: 'David Brown', bot: 'Sales Bot', time: '15 min ago', status: 'completed' },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your bots.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversation Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-dark backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Conversation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Conversations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-dark backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conv, index) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{conv.user}</p>
                      <p className="text-sm text-gray-400">{conv.bot}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{conv.time}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          conv.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {conv.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
