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
import { BusinessesService } from './businesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all businesses for current user' })
  async findAll(@Request() req) {
    return this.businessesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.businessesService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new business' })
  async create(@Body() data: any, @Request() req) {
    return this.businessesService.create(data, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update business' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.businessesService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete business' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.businessesService.remove(id, req.user.id);
  }
}
