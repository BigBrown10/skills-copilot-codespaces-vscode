'use client'

import { ReactNode, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

interface StatsCardProps {
  title: string
  value: number
  change: number
  icon: ReactNode
  trend: 'up' | 'down'
  suffix?: string
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  trend,
  suffix = '',
}: StatsCardProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card hover-lift"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
          {icon}
        </div>
        <div className={clsx(
          'flex items-center gap-1 px-2 py-1 rounded text-sm font-medium',
          trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        )}>
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">
          {count.toLocaleString()}{suffix}
        </p>
      </div>
    </motion.div>
  )
}
