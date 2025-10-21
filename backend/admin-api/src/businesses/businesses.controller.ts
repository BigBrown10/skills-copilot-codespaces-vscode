import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BusinessesService } from './businesses.service';

@ApiTags('businesses')
@ApiBearerAuth()
@Controller('businesses')
@UseGuards(AuthGuard('jwt'))
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all businesses' })
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by ID' })
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  create(@Body() createData: any) {
    return this.businessesService.create(createData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update business' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.businessesService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete business' })
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }
}
