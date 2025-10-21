import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats(@Query('businessId') businessId?: string) {
    return this.analyticsService.getDashboardStats(businessId);
  }

  @Get('bots/:botId')
  @ApiOperation({ summary: 'Get analytics for a specific bot' })
  getBotAnalytics(@Param('botId') botId: string) {
    return this.analyticsService.getBotAnalytics(botId);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get conversation trends' })
  getConversationTrends(
    @Query('businessId') businessId?: string,
    @Query('days') days?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.analyticsService.getConversationTrends(businessId, daysNum);
  }
}
