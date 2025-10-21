import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class BotsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; businessId: string; platform: string; config?: any }) {
    return this.prisma.bot.create({ data })
  }

  async findAll() {
    return this.prisma.bot.findMany({
      include: {
        business: {
          select: { id: true, name: true },
        },
        conversations: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  async findOne(id: string) {
    return this.prisma.bot.findUnique({
      where: { id },
      include: {
        business: true,
        conversations: {
          include: {
            messages: true,
          },
        },
      },
    })
  }

  async update(id: string, data: any) {
    return this.prisma.bot.update({
      where: { id },
      data,
    })
  }

  async remove(id: string) {
    return this.prisma.bot.delete({
      where: { id },
    })
  }

  async toggleActive(id: string) {
    const bot = await this.prisma.bot.findUnique({ where: { id } })
    return this.prisma.bot.update({
      where: { id },
      data: { isActive: !bot.isActive },
    })
  }
}
