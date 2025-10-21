import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId?: string) {
    return this.prisma.bot.findMany({
      where: businessId ? { businessId } : {},
      include: {
        business: true,
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.bot.findUnique({
      where: { id },
      include: {
        business: true,
        conversations: {
          take: 10,
          orderBy: { startedAt: 'desc' },
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.bot.create({
      data,
      include: {
        business: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.bot.update({
      where: { id },
      data,
      include: {
        business: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.bot.delete({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.bot.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
