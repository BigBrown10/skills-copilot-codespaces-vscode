import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(businessId?: string) {
    const where = businessId ? { businessId } : {};

    const [totalBots, totalConversations, totalMessages, activeConversations] =
      await Promise.all([
        this.prisma.bot.count({ where }),
        this.prisma.conversation.count({ where }),
        this.prisma.message.count(),
        this.prisma.conversation.count({
          where: { ...where, status: 'ACTIVE' },
        }),
      ]);

    return {
      totalBots,
      totalConversations,
      totalMessages,
      activeConversations,
    };
  }

  async getBotAnalytics(botId: string) {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
      include: {
        conversations: {
          include: {
            messages: true,
          },
        },
      },
    });

    if (!bot) {
      return null;
    }

    const totalConversations = bot.conversations.length;
    const totalMessages = bot.conversations.reduce(
      (sum, conv) => sum + conv.messages.length,
      0,
    );
    const averageMessagesPerConversation =
      totalConversations > 0 ? totalMessages / totalConversations : 0;

    return {
      botId,
      botName: bot.name,
      totalConversations,
      totalMessages,
      averageMessagesPerConversation,
      status: bot.status,
    };
  }

  async getConversationTrends(businessId?: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where = businessId
      ? { businessId, startedAt: { gte: startDate } }
      : { startedAt: { gte: startDate } };

    const conversations = await this.prisma.conversation.findMany({
      where,
      select: {
        startedAt: true,
        status: true,
      },
    });

    // Group by date
    const trends = conversations.reduce((acc, conv) => {
      const date = conv.startedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, count: 0 };
      }
      acc[date].count++;
      return acc;
    }, {} as Record<string, { date: string; count: number }>);

    return Object.values(trends).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }
}
