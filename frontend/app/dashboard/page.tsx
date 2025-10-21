'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react'
import StatsCard from '@/components/dashboard/stats-card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { name: 'Mon', conversations: 65 },
  { name: 'Tue', conversations: 78 },
  { name: 'Wed', conversations: 90 },
  { name: 'Thu', conversations: 81 },
  { name: 'Fri', conversations: 95 },
  { name: 'Sat', conversations: 72 },
  { name: 'Sun', conversations: 56 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
          Dashboard
        </h1>
        <p className="text-gray-400">Monitor your chatbot performance and analytics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Conversations"
          value={1234}
          change={12.5}
          icon={<MessageSquare className="w-6 h-6" />}
          trend="up"
        />
        <StatsCard
          title="Active Users"
          value={856}
          change={8.2}
          icon={<Users className="w-6 h-6" />}
          trend="up"
        />
        <StatsCard
          title="Response Rate"
          value={98.5}
          change={2.1}
          icon={<TrendingUp className="w-6 h-6" />}
          trend="up"
          suffix="%"
        />
        <StatsCard
          title="Avg Response Time"
          value={2.3}
          change={-15.3}
          icon={<Clock className="w-6 h-6" />}
          trend="down"
          suffix="s"
        />
      </div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Conversation Trends
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="conversations"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorConversations)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            { user: 'John Doe', action: 'Started a conversation', time: '2 minutes ago', platform: 'WhatsApp' },
            { user: 'Jane Smith', action: 'Booked an appointment', time: '15 minutes ago', platform: 'Telegram' },
            { user: 'Mike Johnson', action: 'Asked for support', time: '1 hour ago', platform: 'WhatsApp' },
            { user: 'Sarah Williams', action: 'Requested information', time: '2 hours ago', platform: 'Telegram' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-white font-medium">{activity.user}</p>
                <p className="text-sm text-gray-400">{activity.action}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{activity.time}</p>
                <p className="text-xs text-blue-400">{activity.platform}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
