import { Module } from '@nestjs/common'
import { BotsController } from './bots.controller'
import { BotsService } from './bots.service'
import { PrismaService } from '../prisma.service'

@Module({
  controllers: [BotsController],
  providers: [BotsService, PrismaService],
  exports: [BotsService],
})
export class BotsModule {}
