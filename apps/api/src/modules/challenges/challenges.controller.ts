import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List challenges' })
  @ApiQuery({ name: 'difficulty', required: false })
  async findAll(@Query('difficulty') difficulty?: string) {
    return this.challengesService.findAll(difficulty);
  }

  @Public()
  @Get('daily')
  @ApiOperation({ summary: 'Get daily challenge' })
  async getDaily() {
    return this.challengesService.getDaily();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get challenge details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.challengesService.findOne(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit challenge solution' })
  async submitSolution(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: { query: string },
  ) {
    return this.challengesService.submitSolution(id, user.sub, body.query);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/hint')
  @ApiOperation({ summary: 'Get hint for challenge' })
  async getHint(
    @Param('id') id: string,
    @Body() body: { currentHintLevel: number },
  ) {
    return this.challengesService.getHint(id, body.currentHintLevel || 0);
  }
}
