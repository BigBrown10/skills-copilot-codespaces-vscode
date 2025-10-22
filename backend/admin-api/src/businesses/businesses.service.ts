import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.business.findMany({
      where: { ownerId: userId },
      include: {
        bots: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        bots: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return business;
  }

  async create(data: any, userId: string) {
    return this.prisma.business.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });
  }

  async update(id: string, data: any, userId: string) {
    const business = await this.findOne(id, userId);

    return this.prisma.business.update({
      where: { id: business.id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const business = await this.findOne(id, userId);

    await this.prisma.business.delete({
      where: { id: business.id },
    });

    return { message: 'Business deleted successfully' };
  }
}
