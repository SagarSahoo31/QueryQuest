import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessonsService.findOne(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  @ApiOperation({ summary: 'Start a lesson' })
  async startLesson(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessonsService.startLesson(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a lesson' })
  async completeLesson(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessonsService.completeLesson(id, user.sub);
  }
}
