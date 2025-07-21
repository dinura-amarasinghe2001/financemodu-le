import dayjs from 'dayjs/esm';
import { ITenant } from 'app/entities/tenantControlModule/tenant/tenant.model';
import { LevelBusinessType } from 'app/entities/enumerations/level-business-type.model';
import { LevelType } from 'app/entities/enumerations/level-type.model';

export interface IOperationalUnit {
  id: number;
  code?: string | null;
  name?: string | null;
  displayName?: string | null;
  levelBusinessType?: keyof typeof LevelBusinessType | null;
  remark?: string | null;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  immediateParentCode?: string | null;
  levelType?: keyof typeof LevelType | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  tenant?: ITenant | null;
}

export type NewOperationalUnit = Omit<IOperationalUnit, 'id'> & { id: null };
