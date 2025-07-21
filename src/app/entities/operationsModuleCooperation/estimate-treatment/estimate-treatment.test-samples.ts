import dayjs from 'dayjs/esm';

import { IEstimateTreatment, NewEstimateTreatment } from './estimate-treatment.model';

export const sampleWithRequiredData: IEstimateTreatment = {
  id: 29934,
};

export const sampleWithPartialData: IEstimateTreatment = {
  id: 26611,
  repairName: 'unruly',
  sh: 'MR',
  type: 'psst whoa',
  partNumber: 'gracefully opposite amid',
  unitPrice: 27779.98,
  treatmentType: 'OTHER',
  quantity: 18087.75,
  approvedPriceState: 'disloyal geez giving',
  opsUnitID: 'boo',
  createdBy: 'phew spirit',
};

export const sampleWithFullData: IEstimateTreatment = {
  id: 23615,
  vehicleTreatmentID: 'genuine whereas',
  fittingChargeName: 'fairly how perp',
  paintName: 'upbeat',
  partName: 'afore',
  repairName: 'misreport',
  other: 'beneficial',
  priceType: 'SYSTEM',
  customPrice: 'pace whoa swill',
  sh: 'MR',
  marketPrice: 19726.74,
  type: 'weight',
  partNumber: 'suspiciously',
  availableQuantity: 15226,
  unitPrice: 14542.76,
  treatmentType: 'PART',
  quantity: 30295.89,
  isSystemPrice: false,
  isPriceConfirmed: true,
  approvedDate: dayjs('2025-04-26'),
  price: 24878.94,
  approvedPrice: 6940.69,
  approvedPriceState: 'ack er',
  estimateTreatmentReason: 'INSURANCE_DECLINED',
  opsUnitID: 'furthermore',
  createdBy: 'furthermore mobility',
  createdDate: dayjs('2025-04-26T00:07'),
  lastModifiedBy: 'wherever',
  lastModifiedDate: dayjs('2025-04-25T20:12'),
};

export const sampleWithNewData: NewEstimateTreatment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
