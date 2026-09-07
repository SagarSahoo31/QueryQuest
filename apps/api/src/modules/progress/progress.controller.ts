import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get overall learning progress' })
  async getOverallProgress(@CurrentUser() user: JwtPayload) {
    return this.progressService.getOverallProgress(user.sub);
  }

  @Get('courses/:courseId')
  @ApiOperation({ summary: 'Get progress for a specific course' })
  async getCourseProgress(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.progressService.getCourseProgress(courseId, user.sub);
  }

  @Get('mastery')
  @ApiOperation({ summary: 'Get topic mastery breakdown' })
  async getTopicMastery(@CurrentUser() user: JwtPayload) {
    return this.progressService.getTopicMastery(user.sub);
  }
}
