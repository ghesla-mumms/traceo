import { Injectable, Logger } from '@nestjs/common';
import { BaseDtoQuery } from '../../core/query/generic.model';
import { GenericQueryService } from '../../core/query/generic-query.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Application } from '../../db/entities/application.entity';
import { Runtime } from '../../db/entities/runtime.entity';
import { Log } from '../../db/entities/log.entity';
import { ApplicationLogsQuery } from '../../../lib/types/interfaces/log.interface';
import { ApiResponse } from '../../../lib/types/dto/response.dto';
import { INTERNAL_SERVER_ERROR } from '../../../lib/helpers/constants';

@Injectable()
export class ApplicationQueryService extends GenericQueryService<
  Application,
  BaseDtoQuery
> {
  private logger: Logger;

  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Application);
    this.logger = new Logger(ApplicationQueryService.name);
  }

  public get builderAlias(): string {
    return 'application';
  }

  public async checkAppExists(id: string | number) {
    const app = await this.getDto(id);
    if (!app) {
      throw new Error(`Application with ID: ${id} does not exists!`);
    }
    return app;
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Application>,
    query: BaseDtoQuery,
  ): SelectQueryBuilder<Application> {
    const { search } = query;

    if (search) {
      builder.where("LOWER(application.name) LIKE LOWER(:name)", {
        name: `%${search}%`
      });
    }

    builder
      .leftJoinAndSelect('application.owner', 'owner')
      .loadRelationCountAndMap(
        "application.membersCount",
        "application.members",
      )
      .addSelect('owner.name', 'owner.email');

    return builder;
  }

  public selectedColumns(): string[] {
    return ["id", "name", "gravatar", "lastIncidentAt", "incidentsCount", "connectedTSDB"];
  }

  public async getApplicationRuntime(appId: number): Promise<ApiResponse<object>> {
    try {
      const config = await this.entityManager
        .getRepository(Runtime)
        .findOneBy({ application: { id: appId } });

      return new ApiResponse("success", undefined, config?.data || {});
    } catch (error) {
      this.logger.error(`[${this.getApplicationRuntime}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async getApplicationLogs(query: ApplicationLogsQuery) {
    const { startDate, endDate, id } = query;

    if (!id) {
      // TODO:
      return new ApiResponse("success", undefined, []);
    }

    try {
      const response = await this.entityManager.getRepository(Log).createQueryBuilder('log')
        .where('log.applicationId = :id', { id })
        .andWhere('log.receiveTimestamp > :startDate', { startDate })
        .andWhere('log.receiveTimestamp < :endDate', { endDate })
        .orderBy('log.receiveTimestamp', 'DESC', "NULLS LAST")
        .select(['log.timestamp', 'log.message', 'log.level', 'log.resources', 'log.receiveTimestamp'])
        .take(1000)
        .getMany();

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getApplicationRuntime}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }
}
