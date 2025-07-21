import dayjs from 'dayjs/esm';
import { IOperationalUnit } from 'app/entities/tenantControlModule/operational-unit/operational-unit.model';

export interface IEnabledERPModule {
  id: number;
  moduleName?: string | null;
  moduleCode?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  operationalUnit?: IOperationalUnit | null;
}

export type NewEnabledERPModule = Omit<IEnabledERPModule, 'id'> & { id: null };
