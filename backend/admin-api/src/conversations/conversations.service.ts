import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: any) {
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

    return this.prisma.conversation.findMany({
      where: {
        botId: { in: botIds },
        ...(query.status && { status: query.status }),
        ...(query.platform && { platform: query.platform }),
      },
      include: {
        bot: {
          select: {
            id: true,
            name: true,
            platform: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: query.limit || 50,
    });
  }

  async findOne(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        bot: {
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
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        bookings: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.bot.business.owner.id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return conversation;
  }

  async getMessages(conversationId: string, userId: string) {
    const conversation = await this.findOne(conversationId, userId);

    return conversation.messages;
  }
}
