import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get overall statistics' })
  getStats() {
    return this.analyticsService.getStats()
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get conversation metrics' })
  getConversationMetrics(@Query('botId') botId?: string) {
    return this.analyticsService.getConversationMetrics(botId)
  }

  @Get('intents')
  @ApiOperation({ summary: 'Get intent distribution' })
  getIntentDistribution() {
    return this.analyticsService.getIntentDistribution()
  }
}
