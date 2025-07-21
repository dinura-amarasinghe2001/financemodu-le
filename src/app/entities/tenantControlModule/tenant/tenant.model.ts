import dayjs from 'dayjs/esm';
import { TenantBusinessType } from 'app/entities/enumerations/tenant-business-type.model';
import { LevelType } from 'app/entities/enumerations/level-type.model';
import { LevelStatus } from 'app/entities/enumerations/level-status.model';

export interface ITenant {
  id: number;
  code?: string | null;
  name?: string | null;
  displayName?: string | null;
  tenantType?: keyof typeof TenantBusinessType | null;
  levelType?: keyof typeof LevelType | null;
  levelStatus?: keyof typeof LevelStatus | null;
  registrationNumber?: string | null;
  taxId?: string | null;
  description?: string | null;
  active?: boolean | null;
  establishedDate?: dayjs.Dayjs | null;
  website?: string | null;
  logo?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewTenant = Omit<ITenant, 'id'> & { id: null };
