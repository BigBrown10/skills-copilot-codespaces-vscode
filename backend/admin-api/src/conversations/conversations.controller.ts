import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ConversationsService } from './conversations.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create conversation' })
  create(@Body() body: { botId: string; customerId: string; platform: string }) {
    return this.conversationsService.create(body)
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations' })
  findAll() {
    return this.conversationsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by id' })
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id)
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get conversation messages' })
  getMessages(@Param('id') id: string) {
    return this.conversationsService.getMessages(id)
  }
}
