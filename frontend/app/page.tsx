'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bot, MessageSquare, BarChart3, Zap, Shield, Globe } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI-Powered Conversations',
      description: 'Human-like interactions powered by Google Gemini AI for natural customer engagement',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Multi-Channel Support',
      description: 'Seamless integration with WhatsApp Business and Telegram for maximum reach',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Real-time insights and conversation logs to optimize your customer service',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Automation',
      description: 'Automate bookings, appointments, and support tickets 24/7',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and compliance with data protection regulations',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Scale',
      description: 'Handle thousands of conversations simultaneously across multiple time zones',
    },
  ]

  return (
    <main className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient font-[family-name:var(--font-space-grotesk)]">
              AI Chatbots for Modern Businesses
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Create intelligent AI agents that handle customer conversations on WhatsApp and Telegram.
              Automate bookings, support, and sales with human-like precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-shadow"
                >
                  Get Started Free
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass-effect rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white font-[family-name:var(--font-space-grotesk)]">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400">
              Powerful features to transform your customer communication
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card hover-lift group"
              >
                <div className="mb-4 text-blue-400 group-hover:text-purple-400 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card gradient-border"
          >
            <h2 className="text-4xl font-bold mb-4 text-white font-[family-name:var(--font-space-grotesk)]">
              Ready to Transform Your Customer Service?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses using AI to automate their customer interactions
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-shadow"
              >
                Start Building Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 AI Chatbot Platform. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
