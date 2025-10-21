'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bot, MessageSquare, Calendar, BarChart3, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const features = [
    {
      icon: Bot,
      title: 'Human-like AI Agents',
      description: 'Create intelligent chatbots powered by GPT-4 that understand context and speak naturally'
    },
    {
      icon: MessageSquare,
      title: 'Multi-Channel Support',
      description: 'Deploy on WhatsApp Business API and Telegram Bot API seamlessly'
    },
    {
      icon: Calendar,
      title: 'Smart Booking System',
      description: 'Automated appointment scheduling and booking management'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track conversations, customer satisfaction, and bot performance'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Responses in milliseconds with edge computing and smart caching'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and compliance with GDPR, CCPA standards'
    }
  ]

  return (
    <main className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Build AI Agents for{' '}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                WhatsApp & Telegram
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Create human-like AI chatbots for bookings, appointments, and customer support. 
              Powered by GPT-4 and built for businesses.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary-600 text-white px-8">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-dark rounded-3xl p-8 backdrop-blur-xl">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.2 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/10 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-white/5 rounded w-1/2"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-gray-300">
            Powerful features to help you build and manage AI chatbots
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="glass-dark rounded-2xl p-6 backdrop-blur-xl cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-dark rounded-3xl p-12 backdrop-blur-xl text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses using AI agents to automate conversations and boost efficiency
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary-600 text-white px-12">
              Start Building Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
