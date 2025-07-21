import dayjs from 'dayjs/esm';

import { TreatmentType } from 'app/entities/enumerations/treatment-type.model';
import { IVehicleModel } from '../vehicle-model/vehicle-model.model';

export interface IVehicleTreatmentRegistry {
  id: number;
  fittingChargeName?: string | null;
  paintName?: string | null;
  partName?: string | null;
  repairName?: string | null;
  otherName?: string | null;
  description?: string | null;
  partNumber?: string | null;
  availableQuantity?: number | null;
  price?: number | null;
  treatmentType?: keyof typeof TreatmentType | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  vehicleModel?: IVehicleModel | null;
}

export type NewVehicleTreatmentRegistry = Omit<IVehicleTreatmentRegistry, 'id'> & { id: null };
