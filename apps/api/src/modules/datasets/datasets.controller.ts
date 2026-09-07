import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatasetsService } from './datasets.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('datasets')
@Controller('datasets')
export class DatasetsController {
  constructor(private datasetsService: DatasetsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all learning datasets' })
  async findAll() {
    return this.datasetsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get dataset details' })
  async findOne(@Param('id') id: string) {
    return this.datasetsService.findOne(id);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get dataset by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.datasetsService.findBySlug(slug);
  }
}
