import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConversationsService } from './conversations.service';

@ApiTags('conversations')
@ApiBearerAuth()
@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all conversations' })
  findAll(@Query('botId') botId?: string, @Query('businessId') businessId?: string) {
    return this.conversationsService.findAll({ botId, businessId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  create(@Body() createData: any) {
    return this.conversationsService.create(createData);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add message to conversation' })
  addMessage(@Param('id') id: string, @Body() messageData: any) {
    return this.conversationsService.addMessage(id, messageData);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update conversation status' })
  updateStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.conversationsService.updateStatus(id, data.status);
  }
}
