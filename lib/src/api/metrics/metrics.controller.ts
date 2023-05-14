import { Query } from "@nestjs/common";
import { Controller, Get, Param } from "@nestjs/common";
import { Body, Delete, Patch, Post, UseGuards } from "@nestjs/common/decorators";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";
import {
  MetricQueryDto,
  MetricsQueryDto,
  UpdateMetricDto
} from "../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { IMetric, MetricPreviewType, MetricResponseType } from "@traceo/types";
import { MetricsService } from "./metrics.service";
import { MetricsQueryService } from "./query/metrics-query.service";

@ApiTags("metrics")
@Controller("metrics")
@UseGuards(new AuthGuard())
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly metricsQueryService: MetricsQueryService
  ) { }

  @Get("/:id")
  async getMetrics(
    @Param("id") id: string,
    @Query() query: MetricsQueryDto
  ): Promise<ApiResponse<IMetric[]>> {
    return await this.metricsQueryService.getProjectMetrics(id, query);
  }

  @Get("/:id/preview/:metricId")
  async getProjectMetricPreviewData(
    @Param("id") id: string,
    @Param("metricId") metricId: string,
    @Query("from") from: number,
    @Query("to") to: number
  ): Promise<ApiResponse<MetricPreviewType>> {
    return await this.metricsQueryService.getProjectMetricPreviewData(id, metricId, from, to);
  }

  @Get("/:id/datasource")
  async getMetricValues(
    @Param("id") projectId: string,
    @Query() query: MetricQueryDto
  ): Promise<ApiResponse<MetricResponseType[]>> {
    return await this.metricsQueryService.getMetricData(projectId, query);
  }

  @Get("/:id/datasource/table")
  async getMetricTableValues(
    @Param("id") projectId: string,
    @Query() query: MetricQueryDto
  ): Promise<ApiResponse<MetricResponseType[]>> {
    return await this.metricsQueryService.getMetricTableData(projectId, query);
  }

  @Post("/:id")
  async createMetric(
    @Param("id") projectId: string,
    @Body() body: UpdateMetricDto
  ): Promise<ApiResponse<string>> {
    return await this.metricsService.createMetric(projectId, body);
  }

  @Patch("/:metricId/update")
  async updateMetric(
    @Param("metricId") metricId: string,
    @Body() body: UpdateMetricDto
  ): Promise<ApiResponse<string>> {
    return await this.metricsService.updateMetric(metricId, body);
  }

  @Delete("/:id")
  async removeMetric(
    @Param("id") metricId: string
  ): Promise<ApiResponse<string>> {
    return await this.metricsService.removeMetric(metricId);
  }
}
