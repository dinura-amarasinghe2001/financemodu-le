import dayjs from 'dayjs/esm';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { Sh } from 'app/entities/enumerations/sh.model';
import { TreatmentType } from 'app/entities/enumerations/treatment-type.model';
import { EstimateTreatmentReason } from 'app/entities/enumerations/estimate-treatment-reason.model';
import { IEstimate } from '../estimate/estimate.model';

export interface IEstimateTreatment {
  id: number;
  vehicleTreatmentID?: string | null;
  fittingChargeName?: string | null;
  paintName?: string | null;
  partName?: string | null;
  repairName?: string | null;
  other?: string | null;
  priceType?: keyof typeof PriceType | null;
  customPrice?: string | null;
  sh?: keyof typeof Sh | null;
  marketPrice?: number | null;
  type?: string | null;
  partNumber?: string | null;
  availableQuantity?: number | null;
  unitPrice?: number | null;
  treatmentType?: keyof typeof TreatmentType | null;
  quantity?: number | null;
  isSystemPrice?: boolean | null;
  isPriceConfirmed?: boolean | null;
  approvedDate?: dayjs.Dayjs | null;
  price?: number | null;
  approvedPrice?: number | null;
  approvedPriceState?: string | null;
  estimateTreatmentReason?: keyof typeof EstimateTreatmentReason | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  estimate?: IEstimate | null;
}

export type NewEstimateTreatment = Omit<IEstimateTreatment, 'id'> & { id: null };
