import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../lib/types/dto/response.dto';
import { DailyOverview, PlotData, AppIncidentsStats } from '../../lib/types/interfaces/statistics.interface';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { StatisticsQueryService } from './query/statistics-query.service';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsQueryService: StatisticsQueryService,
  ) { }

  @Get()
  @AuthRequired()
  async getApplicationStatistics(
    @Query('id') id: string
  ): Promise<ApiResponse<AppIncidentsStats>> {
    return await this.statisticsQueryService.getApplicationStatistics(id);
  }

  @Get('/incident/total')
  @AuthRequired()
  async getIncidentTotalOverview(
    @Query('id') id: string
  ): Promise<ApiResponse<PlotData[]>> {
    return await this.statisticsQueryService.getTotalOverviewForIncident(
      id
    );
  }

  @Get('/daily')
  @AuthRequired()
  async getDailyOverview(
    @Query('id') id: string
  ): Promise<ApiResponse<DailyOverview>> {
    return await this.statisticsQueryService.getDailyOverview(id);
  }

  @Get('/total')
  @AuthRequired()
  async getTotalOverview(
    @Query('id') id: string
  ): Promise<ApiResponse<PlotData[]>> {
    return await this.statisticsQueryService.getTotalOverview(id);
  }
}
