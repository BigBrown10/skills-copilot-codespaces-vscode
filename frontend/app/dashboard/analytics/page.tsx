'use client'

import { motion } from 'framer-motion'
import { TrendingUp, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  const stats = [
    {
      title: 'Total Messages',
      value: '24,567',
      change: '+15.3%',
      icon: MessageSquare,
    },
    {
      title: 'Avg. Response Time',
      value: '1.2s',
      change: '-12%',
      icon: Clock,
    },
    {
      title: 'Resolution Rate',
      value: '94.2%',
      change: '+2.4%',
      icon: CheckCircle,
    },
    {
      title: 'User Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      icon: TrendingUp,
    },
  ]

  const topBots = [
    { name: 'Customer Support Bot', conversations: 1234, rating: 4.9 },
    { name: 'Booking Bot', conversations: 987, rating: 4.7 },
    { name: 'Sales Assistant', conversations: 756, rating: 4.6 },
  ]

  const conversationsByHour = [
    { hour: '00:00', count: 45 },
    { hour: '04:00', count: 23 },
    { hour: '08:00', count: 156 },
    { hour: '12:00', count: 234 },
    { hour: '16:00', count: 189 },
    { hour: '20:00', count: 112 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Track performance and insights across all your bots</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Analytics Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversation Volume */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-dark backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Conversation Volume (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversationsByHour.map((item, index) => (
                  <motion.div
                    key={item.hour}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-sm text-gray-400 w-16">{item.hour}</span>
                    <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / 234) * 100}%` }}
                        transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-lg"
                      />
                    </div>
                    <span className="text-sm text-white font-medium w-12 text-right">
                      {item.count}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Bots */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-dark backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBots.map((bot, index) => (
                  <motion.div
                    key={bot.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{bot.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white font-medium">{bot.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Conversations</span>
                      <span className="text-white font-medium">{bot.conversations}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Sentiment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="glass-dark backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">User Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Positive', value: 78, color: 'bg-green-500' },
                { label: 'Neutral', value: 18, color: 'bg-blue-500' },
                { label: 'Negative', value: 4, color: 'bg-red-500' },
              ].map((sentiment, index) => (
                <motion.div
                  key={sentiment.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-8 border-white/10 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{sentiment.value}%</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{sentiment.label}</h3>
                  <div className={`h-2 ${sentiment.color} rounded-full mx-auto`} style={{ width: `${sentiment.value}%` }} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
