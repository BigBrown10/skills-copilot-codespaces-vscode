import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BotsService } from './bots.service';

@ApiTags('bots')
@ApiBearerAuth()
@Controller('bots')
@UseGuards(AuthGuard('jwt'))
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bots' })
  findAll(@Query('businessId') businessId?: string) {
    return this.botsService.findAll(businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bot by ID' })
  findOne(@Param('id') id: string) {
    return this.botsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new bot' })
  create(@Body() createData: any) {
    return this.botsService.create(createData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update bot' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.botsService.update(id, updateData);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update bot status' })
  updateStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.botsService.updateStatus(id, data.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bot' })
  remove(@Param('id') id: string) {
    return this.botsService.remove(id);
  }
}
