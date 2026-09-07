import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published courses' })
  async findAll() {
    return this.coursesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const course = await this.coursesService.findOne(id);
    const progress = await this.coursesService.getCourseProgress(id, user.sub);
    return { ...course, progress };
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get course by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }
}
