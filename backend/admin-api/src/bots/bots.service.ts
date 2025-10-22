import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const businesses = await this.prisma.business.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const businessIds = businesses.map((b) => b.id);

    return this.prisma.bot.findMany({
      where: {
        businessId: { in: businessIds },
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const bot = await this.prisma.bot.findUnique({
      where: { id },
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
        conversations: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
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

    return bot;
  }

  async create(data: any, userId: string) {
    // Verify business ownership
    const business = await this.prisma.business.findUnique({
      where: { id: data.businessId },
    });

    if (!business || business.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.bot.create({
      data,
      include: {
        business: true,
      },
    });
  }

  async update(id: string, data: any, userId: string) {
    const bot = await this.findOne(id, userId);

    return this.prisma.bot.update({
      where: { id: bot.id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const bot = await this.findOne(id, userId);

    await this.prisma.bot.delete({
      where: { id: bot.id },
    });

    return { message: 'Bot deleted successfully' };
  }

  async toggleStatus(id: string, userId: string) {
    const bot = await this.findOne(id, userId);

    const newStatus = bot.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    return this.prisma.bot.update({
      where: { id: bot.id },
      data: { status: newStatus },
    });
  }
}
