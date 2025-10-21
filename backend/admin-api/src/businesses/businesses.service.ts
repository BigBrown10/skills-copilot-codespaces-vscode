import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.business.findMany({
      include: {
        users: true,
        bots: true,
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.business.findUnique({
      where: { id },
      include: {
        users: true,
        bots: true,
        conversations: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.business.create({
      data,
      include: {
        users: true,
        bots: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.business.update({
      where: { id },
      data,
      include: {
        users: true,
        bots: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.business.delete({ where: { id } });
  }
}
