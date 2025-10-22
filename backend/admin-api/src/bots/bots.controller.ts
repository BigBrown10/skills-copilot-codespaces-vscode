import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BotsService } from './bots.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bots')
@Controller('bots')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bots for current user' })
  async findAll(@Request() req) {
    return this.botsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bot by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.botsService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new bot' })
  async create(@Body() data: any, @Request() req) {
    return this.botsService.create(data, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update bot' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.botsService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bot' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.botsService.remove(id, req.user.id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Toggle bot status' })
  async toggleStatus(@Param('id') id: string, @Request() req) {
    return this.botsService.toggleStatus(id, req.user.id);
  }
}
