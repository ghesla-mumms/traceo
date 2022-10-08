import { Environment } from "lib/core/generic.model";
import { MemberRole } from "lib/db/entities/account-member-relationship.entity";

export interface OwnerAccount {
  name: string;
}

export interface Application {
  id?: number;
  name: string;
  dsn?: string;
  owner: OwnerAccount;
  technology?: string;
  framework?: string;
  logo?: string;
  lastIncidentAt?: number;
  defaultEnv?: Environment;
}

export interface ApplicationResponse extends Application {
  member: {
    role: MemberRole;
  };
}