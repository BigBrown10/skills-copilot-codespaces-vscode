import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; ownerId: string; plan?: string }) {
    return this.prisma.business.create({ data })
  }

  async findAll() {
    return this.prisma.business.findMany({
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        bots: true,
      },
    })
  }

  async findOne(id: string) {
    return this.prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        bots: true,
      },
    })
  }

  async update(id: string, data: any) {
    return this.prisma.business.update({
      where: { id },
      data,
    })
  }

  async remove(id: string) {
    return this.prisma.business.delete({
      where: { id },
    })
  }
}
