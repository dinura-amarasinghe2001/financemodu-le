import dayjs from 'dayjs/esm';
import { ITenant } from 'app/entities/tenantControlModule/tenant/tenant.model';

export interface IFlag {
  id: number;
  code?: string | null;
  flagId?: string | null;
  flagName?: string | null;
  flagValue?: boolean | null;
  description?: string | null;
  isDeleted?: boolean | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  tenant?: ITenant | null;
}

export type NewFlag = Omit<IFlag, 'id'> & { id: null };
