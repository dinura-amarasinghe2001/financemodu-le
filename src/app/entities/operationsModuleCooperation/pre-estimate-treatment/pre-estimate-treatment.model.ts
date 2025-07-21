import dayjs from 'dayjs/esm';
import { TreatmentType } from 'app/entities/enumerations/treatment-type.model';
import { Sh } from 'app/entities/enumerations/sh.model';
import { IPreEstimate } from '../pre-estimate/pre-estimate.model';
import { PriceType } from 'app/entities/enumerations/price-type.model';

export interface IPreEstimateTreatment {
  id: number;
  vehicleTreatmentID?: string | null;
  fittingChargeName?: string | null;
  paintName?: string | null;
  partName?: string | null;
  partNumber?: string | null;
  repairName?: string | null;
  other?: string | null;
  sh?: keyof typeof Sh | null;
  marketPrice?: number | null;
  priceType?: keyof typeof PriceType | null;
  type?: string | null;
  customPrice?: string | null;
  unitPrice?: number | null;
  price?: number | null;
  totalPrice?: number | null;
  isSystemPrice?: boolean | null;
  availableQuantity?: number | null;
  treatmentType?: keyof typeof TreatmentType | null;
  quantity?: number | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  preEstimate?: IPreEstimate | null;
}

export type NewPreEstimateTreatment = Omit<IPreEstimateTreatment, 'id'> & { id: null };
