'use client'

import { motion } from 'framer-motion'
import { Filter, Download } from 'lucide-react'
import Button from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const conversationData = [
  { date: 'Jan', whatsapp: 120, telegram: 80 },
  { date: 'Feb', whatsapp: 145, telegram: 95 },
  { date: 'Mar', whatsapp: 165, telegram: 110 },
  { date: 'Apr', whatsapp: 190, telegram: 125 },
  { date: 'May', whatsapp: 210, telegram: 140 },
  { date: 'Jun', whatsapp: 235, telegram: 160 },
]

const intentData = [
  { name: 'Booking', value: 400, color: '#3B82F6' },
  { name: 'Support', value: 300, color: '#8B5CF6' },
  { name: 'Inquiry', value: 200, color: '#10B981' },
  { name: 'Other', value: 100, color: '#F59E0B' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
            Analytics
          </h1>
          <p className="text-gray-400">Detailed insights into your chatbot performance</p>
        </motion.div>

        <div className="flex gap-3">
          <Button variant="secondary" icon={<Filter className="w-5 h-5" />}>
            Filter
          </Button>
          <Button variant="secondary" icon={<Download className="w-5 h-5" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Conversation Volume */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Conversation Volume by Platform
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={conversationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="whatsapp" fill="#3B82F6" />
            <Bar dataKey="telegram" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Intent Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Intent Distribution
        </h2>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={intentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {intentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Conversation Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Recent Conversations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Platform</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Intent</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { customer: 'John Doe', platform: 'WhatsApp', intent: 'Booking', status: 'Completed', date: '2024-01-15' },
                { customer: 'Jane Smith', platform: 'Telegram', intent: 'Support', status: 'Active', date: '2024-01-15' },
                { customer: 'Mike Johnson', platform: 'WhatsApp', intent: 'Inquiry', status: 'Completed', date: '2024-01-14' },
                { customer: 'Sarah Williams', platform: 'Telegram', intent: 'Booking', status: 'Completed', date: '2024-01-14' },
                { customer: 'Tom Brown', platform: 'WhatsApp', intent: 'Support', status: 'Active', date: '2024-01-13' },
              ].map((log, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white">{log.customer}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.platform === 'WhatsApp' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {log.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{log.intent}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
