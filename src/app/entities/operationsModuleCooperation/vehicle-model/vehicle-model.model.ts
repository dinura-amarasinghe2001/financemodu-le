import dayjs from 'dayjs/esm';
import { IBrand } from 'app/entities/operationsModuleCooperation/brand/brand.model';

export interface IVehicleModel {
  id: number;
  modelName?: string | null;
  description?: string | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  brand?: IBrand | null;
}

export type NewVehicleModel = Omit<IVehicleModel, 'id'> & { id: null };
