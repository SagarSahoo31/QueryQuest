import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SqlService } from './sql.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('sql')
@Controller('sql')
export class SqlController {
  constructor(private sqlService: SqlService) {}

  @Post('execute')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Execute a SQL query' })
  async executeQuery(
    @CurrentUser() user: JwtPayload,
    @Body() body: { datasetId: string; query: string },
  ) {
    return this.sqlService.executeQuery(body.datasetId, body.query, user.sub);
  }

  @Public()
  @Get('databases')
  @ApiOperation({ summary: 'List available databases' })
  async getDatabases() {
    return this.sqlService.getDatabases();
  }

  @Public()
  @Get('databases/:id/schema')
  @ApiOperation({ summary: 'Get database schema' })
  async getDatabaseSchema(@Param('id') id: string) {
    return this.sqlService.getDatabaseSchema(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiOperation({ summary: 'Get query history' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  async getQueryHistory(
    @CurrentUser() user: JwtPayload,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return this.sqlService.getQueryHistory(user.sub, limit, offset);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saved')
  @ApiOperation({ summary: 'Save a query' })
  async saveQuery(
    @CurrentUser() user: JwtPayload,
    @Body() body: { title: string; query: string; datasetId?: string; description?: string },
  ) {
    return this.sqlService.saveQuery(
      user.sub,
      body.title,
      body.query,
      body.datasetId,
      body.description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('saved')
  @ApiOperation({ summary: 'Get saved queries' })
  async getSavedQueries(@CurrentUser() user: JwtPayload) {
    return this.sqlService.getSavedQueries(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('saved/:id')
  @ApiOperation({ summary: 'Delete a saved query' })
  async deleteSavedQuery(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    const deleted = await this.sqlService.deleteSavedQuery(user.sub, id);
    return { success: deleted };
  }
}
