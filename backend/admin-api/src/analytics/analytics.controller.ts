import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview' })
  async getOverview(@Request() req) {
    return this.analyticsService.getOverview(req.user.id);
  }

  @Get('bots/:botId')
  @ApiOperation({ summary: 'Get bot analytics' })
  async getBotAnalytics(@Param('botId') botId: string, @Request() req) {
    return this.analyticsService.getBotAnalytics(botId, req.user.id);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get conversation analytics' })
  async getConversationAnalytics(@Request() req, @Query() query: any) {
    return this.analyticsService.getConversationAnalytics(req.user.id, query);
  }
}
