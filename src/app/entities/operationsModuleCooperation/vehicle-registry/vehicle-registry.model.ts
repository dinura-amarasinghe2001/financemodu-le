import dayjs from 'dayjs/esm';
import { IClientRegistry } from '../client-registry/client-registry.model';

export interface IVehicleRegistry {
  id: number;
  licenseNo?: string | null;
  yom?: string | null;
  brand?: string | null;
  model?: string | null;
  brandID?: string | null;
  modelID?: string | null;
  modelNumber?: string | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  clientRegistry?: IClientRegistry | null;
}

export type NewVehicleRegistry = Omit<IVehicleRegistry, 'id'> & { id: null };
