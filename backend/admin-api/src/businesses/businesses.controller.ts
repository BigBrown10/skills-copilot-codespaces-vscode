import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { BusinessesService } from './businesses.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @ApiOperation({ summary: 'Create business' })
  create(@Body() body: { name: string; ownerId: string; plan?: string }) {
    return this.businessesService.create(body)
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses' })
  findAll() {
    return this.businessesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by id' })
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update business' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.businessesService.update(id, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete business' })
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id)
  }
}
