import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('gamification')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get gamification profile' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.gamificationService.getProfile(user.sub);
  }

  @Get('badges')
  @ApiOperation({ summary: 'Get all badges with user progress' })
  async getBadges(@CurrentUser() user: JwtPayload) {
    return this.gamificationService.getBadges(user.sub);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiQuery({ name: 'type', enum: ['weekly', 'monthly', 'all-time'], required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getLeaderboard(
    @Query('type') type: 'weekly' | 'monthly' | 'all-time' = 'weekly',
    @Query('limit') limit: number = 20,
  ) {
    return this.gamificationService.getLeaderboard(type, limit);
  }

  @Post('streak/update')
  @ApiOperation({ summary: 'Update daily streak' })
  async updateStreak(@CurrentUser() user: JwtPayload) {
    return this.gamificationService.updateStreak(user.sub);
  }
}
