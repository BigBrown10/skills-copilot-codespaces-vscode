import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { BotsService } from './bots.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('bots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post()
  @ApiOperation({ summary: 'Create bot' })
  create(@Body() body: { name: string; businessId: string; platform: string; config?: any }) {
    return this.botsService.create(body)
  }

  @Get()
  @ApiOperation({ summary: 'Get all bots' })
  findAll() {
    return this.botsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bot by id' })
  findOne(@Param('id') id: string) {
    return this.botsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bot' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.botsService.update(id, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bot' })
  remove(@Param('id') id: string) {
    return this.botsService.remove(id)
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle bot active status' })
  toggleActive(@Param('id') id: string) {
    return this.botsService.toggleActive(id)
  }
}
