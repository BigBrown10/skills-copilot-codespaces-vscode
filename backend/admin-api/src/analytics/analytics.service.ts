import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalConversations, totalUsers, totalBots, totalMessages] = await Promise.all([
      this.prisma.conversation.count(),
      this.prisma.user.count(),
      this.prisma.bot.count(),
      this.prisma.message.count(),
    ])

    return {
      totalConversations,
      totalUsers,
      totalBots,
      totalMessages,
      responseRate: 98.5, // Placeholder
      avgResponseTime: 2.3, // Placeholder in seconds
    }
  }

  async getConversationMetrics(botId?: string) {
    const where = botId ? { botId } : {}

    const conversations = await this.prisma.conversation.findMany({
      where,
      include: {
        messages: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    // Group by date
    const metrics = conversations.reduce((acc, conv) => {
      const date = conv.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, count: 0, messages: 0 }
      }
      acc[date].count++
      acc[date].messages += conv.messages.length
      return acc
    }, {} as Record<string, any>)

    return Object.values(metrics)
  }

  async getIntentDistribution() {
    // This would be calculated based on actual conversation data
    // For now, returning mock data
    return [
      { intent: 'BOOKING', count: 400 },
      { intent: 'SUPPORT', count: 300 },
      { intent: 'INQUIRY', count: 200 },
      { intent: 'OTHER', count: 100 },
    ]
  }
}
