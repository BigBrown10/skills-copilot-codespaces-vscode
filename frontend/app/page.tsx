'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bot, MessageSquare, BarChart3, Zap, Shield, Globe, ArrowRight, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Agents',
    description: 'Human-like conversations powered by Google Gemini AI',
  },
  {
    icon: MessageSquare,
    title: 'Multi-Channel',
    description: 'WhatsApp & Telegram support out of the box',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time insights and conversation analytics',
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Deploy your chatbot in minutes, not days',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with end-to-end encryption',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Support for 50+ languages automatically',
  },
]

const useCases = [
  'Appointment Booking',
  'Customer Support',
  'Lead Generation',
  'Order Management',
  'FAQ Automation',
  'Service Booking',
]

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="gradient-mesh absolute inset-0 opacity-50" />
        
        <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white"
          >
            🤖 ChatBot<span className="text-blue-400">AI</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <Link href="/auth/signin" className="px-4 py-2 text-white hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-glow">
              Get Started
            </Link>
          </motion.div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Build AI Agents for
              <span className="text-gradient"> WhatsApp & Telegram</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Automate customer conversations with intelligent AI chatbots powered by Google Gemini.
              No coding required.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/dashboard" 
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all btn-glow flex items-center justify-center gap-2"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-4 glass text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex items-center justify-center gap-8 text-gray-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-400">
              Powerful features to automate and scale your customer conversations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-8 rounded-2xl card-hover"
              >
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-primary-950">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for every business
            </h2>
            <p className="text-xl text-gray-400">
              From startups to enterprises, automate any workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark p-6 rounded-xl text-center"
              >
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-white font-semibold">{useCase}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-3xl text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to automate your conversations?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of businesses using AI to scale their customer support
            </p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all btn-glow"
            >
              Start Building Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-primary-800">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ChatBotAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
