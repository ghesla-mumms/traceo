import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestUser } from 'src/auth/auth.model';
import { MEMBER_STATUS } from 'src/db/entities/account-workspace-relationship.entity';
import { Account } from 'src/db/entities/account.entity';
import { Cluster } from 'src/db/entities/cluster.entity';
import dateUtils from 'src/helpers/dateUtils';
import { EntityManager } from 'typeorm';
import { CreateClusterModel } from './cluster.model';
import { AccountClusterRelationship } from 'src/db/entities/account-cluster-relationship.entity';

@Injectable()
export class ClusterService {
    constructor(
        readonly entityManager: EntityManager
    ) { }

    public async createCluster(data: CreateClusterModel, account: RequestUser): Promise<Cluster> {
        const { id } = account;

        return await this.entityManager.transaction(async (manager) => {

            const account = await manager.getRepository(Account).findOneBy({ id });
            if (!account) {
                throw new NotFoundException();
            }

            const cluster = await manager.getRepository(Cluster).save({
                ...data,
                owner: account,
                createdAt: dateUtils.toUnix(),
                updatedAt: dateUtils.toUnix()
            });

            await this.createAcr(
                account,
                cluster,
                MEMBER_STATUS.OWNER,
                manager
            );

            return cluster;
        });
    }

    public async handleClusterOnCreateWithWorkspace(id: string, manager: EntityManager = this.entityManager): Promise<Cluster> {
        const cluster = await manager.getRepository(Cluster).findOneBy({ id });
        await manager.getRepository(Cluster).save({ ...cluster, appsCount: (cluster?.appsCount || 0) + 1 });

        return cluster;
    }

    public async createAcr(account: Account, cluster: Cluster, memberStatus?: MEMBER_STATUS, manager: EntityManager = this.entityManager): Promise<void> {
        const acr: Partial<AccountClusterRelationship> = {
            account,
            cluster,
            status: memberStatus,
            createdAt: dateUtils.toUnix(),
            updatedAt: dateUtils.toUnix()
        }
        await manager.getRepository(AccountClusterRelationship).save(acr);
    }
}