import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { botId?: string; businessId?: string }) {
    return this.prisma.conversation.findMany({
      where: filters,
      include: {
        bot: true,
        messages: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        bot: true,
        business: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        bookings: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.conversation.create({
      data,
      include: {
        bot: true,
        messages: true,
      },
    });
  }

  async addMessage(conversationId: string, messageData: any) {
    return this.prisma.message.create({
      data: {
        conversationId,
        ...messageData,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.conversation.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
