import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string) {
    const businesses = await this.prisma.business.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const businessIds = businesses.map((b) => b.id);

    const bots = await this.prisma.bot.findMany({
      where: {
        businessId: { in: businessIds },
      },
      select: { id: true },
    });

    const botIds = bots.map((b) => b.id);

    const [
      totalConversations,
      activeConversations,
      totalMessages,
      totalBookings,
    ] = await Promise.all([
      this.prisma.conversation.count({
        where: { botId: { in: botIds } },
      }),
      this.prisma.conversation.count({
        where: {
          botId: { in: botIds },
          status: 'ACTIVE',
        },
      }),
      this.prisma.message.count({
        where: {
          conversation: {
            botId: { in: botIds },
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          conversation: {
            botId: { in: botIds },
          },
        },
      }),
    ]);

    return {
      totalConversations,
      activeConversations,
      totalMessages,
      totalBookings,
      activeBots: bots.length,
    };
  }

  async getBotAnalytics(botId: string, userId: string) {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
      include: {
        business: {
          include: {
            owner: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    if (bot.business.owner.id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const [
      totalConversations,
      activeConversations,
      totalMessages,
      totalBookings,
      completedConversations,
    ] = await Promise.all([
      this.prisma.conversation.count({
        where: { botId },
      }),
      this.prisma.conversation.count({
        where: {
          botId,
          status: 'ACTIVE',
        },
      }),
      this.prisma.message.count({
        where: {
          conversation: {
            botId,
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          conversation: {
            botId,
          },
        },
      }),
      this.prisma.conversation.count({
        where: {
          botId,
          status: 'COMPLETED',
        },
      }),
    ]);

    const successRate =
      totalConversations > 0
        ? ((completedConversations / totalConversations) * 100).toFixed(2)
        : 0;

    return {
      botId,
      botName: bot.name,
      totalConversations,
      activeConversations,
      completedConversations,
      totalMessages,
      totalBookings,
      successRate: `${successRate}%`,
      averageMessagesPerConversation:
        totalConversations > 0
          ? (totalMessages / totalConversations).toFixed(2)
          : 0,
    };
  }

  async getConversationAnalytics(userId: string, query: any) {
    const businesses = await this.prisma.business.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const businessIds = businesses.map((b) => b.id);

    const bots = await this.prisma.bot.findMany({
      where: {
        businessId: { in: businessIds },
      },
      select: { id: true },
    });

    const botIds = bots.map((b) => b.id);

    // Get conversations grouped by date
    const conversations = await this.prisma.conversation.groupBy({
      by: ['createdAt'],
      where: {
        botId: { in: botIds },
      },
      _count: true,
    });

    // Get platform distribution
    const platformStats = await this.prisma.conversation.groupBy({
      by: ['platform'],
      where: {
        botId: { in: botIds },
      },
      _count: true,
    });

    return {
      conversationsByDate: conversations,
      platformDistribution: platformStats,
    };
  }
}
