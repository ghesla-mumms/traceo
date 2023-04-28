import { Injectable, Logger } from '@nestjs/common';
import { PerformanceQuery, VitalsResponse, Performance, MAP_INTERVAL, MAP_MAX_VALUE } from '@traceo/types';
import { INTERNAL_SERVER_ERROR } from '../../common/helpers/constants';
import { ClickhouseService } from '../../common/services/clickhouse/clickhouse.service';
import { ApiResponse } from '../../common/types/dto/response.dto';

@Injectable()
export class PerformanceService {
    private readonly logger: Logger;
    constructor(
        private readonly clickhouseService: ClickhouseService
    ) {
        this.logger = new Logger(PerformanceService.name);
    }

    public async getPerformanceList(projectId: string, query: PerformanceQuery): Promise<ApiResponse<Performance[]>> {
        try {
            const perfs = await this.clickhouseService.loadPermormance(projectId, query);
            return new ApiResponse("success", undefined, perfs);
        } catch (error) {
            this.logger.error(`[${this.getPerformanceList.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
        }
    }

    public async getPerformanceBins(projectId: string, query: PerformanceQuery): Promise<ApiResponse<VitalsResponse>> {
        try {
            const perfs = await this.clickhouseService.loadPermormance(projectId, query);
            const vitals = perfs
                .sort((a, b) => a.value - b.value)
                .reduce((acc, val) => {
                    acc[val.name] = acc[val.name] || [];
                    acc[val.name].push(val.value);

                    return acc;
                }, {});

            const result = Object.entries(vitals).reduce((acc, [key, value]) => {
                acc[key] = this.pushToBins(value as number[], MAP_INTERVAL[key], MAP_MAX_VALUE[key]);
                return acc;
            }, {});

            return new ApiResponse("success", undefined, result);
        } catch (error) {
            this.logger.error(`[${this.getPerformanceBins.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
        }
    }

    private pushToBins(values: number[], INTERVAL: number = 100, MAX_VALUE: number = 100) {
        const bins = [];

        // iterate to the max value in array
        const LAST_VALUE = values[values.length - 1];
        // last_value multipled by 3 get some space in chart after last value 
        const MAX = LAST_VALUE > MAX_VALUE ? LAST_VALUE + INTERVAL * 3 : MAX_VALUE;

        for (let i = 0; i <= MAX; i += INTERVAL) {
            const count = values
                .filter((value) => value >= i && value <= i + INTERVAL)
                .length;

            bins.push({
                bin: i,
                count
            });
        }

        return bins;
    }
}
