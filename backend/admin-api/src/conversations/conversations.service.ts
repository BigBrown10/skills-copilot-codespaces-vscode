import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { botId: string; customerId: string; platform: string }) {
    return this.prisma.conversation.create({ data })
  }

  async findAll() {
    return this.prisma.conversation.findMany({
      include: {
        bot: {
          select: { id: true, name: true, platform: true },
        },
        messages: {
          take: 1,
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        bot: true,
        messages: {
          orderBy: { timestamp: 'asc' },
        },
        bookings: true,
      },
    })
  }

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    })
  }
}
