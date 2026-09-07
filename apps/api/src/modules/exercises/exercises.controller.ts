import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('exercises')
@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get exercise by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.exercisesService.findOne(id, user.sub);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit exercise answer' })
  async submitAnswer(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: any,
  ) {
    return this.exercisesService.submitAnswer(id, user.sub, body);
  }

  @Post(':id/hint')
  @ApiOperation({ summary: 'Get hint for exercise' })
  async getHint(
    @Param('id') id: string,
    @Body() body: { currentHintLevel: number },
  ) {
    return this.exercisesService.getHint(id, body.currentHintLevel || 0);
  }

  @Get(':id/solution')
  @ApiOperation({ summary: 'Get solution for exercise' })
  async getSolution(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.exercisesService.getSolution(id, user.sub);
  }
}
