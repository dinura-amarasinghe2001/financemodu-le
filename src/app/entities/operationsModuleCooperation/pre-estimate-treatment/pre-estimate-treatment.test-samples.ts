import dayjs from 'dayjs/esm';

import { IPreEstimateTreatment, NewPreEstimateTreatment } from './pre-estimate-treatment.model';

export const sampleWithRequiredData: IPreEstimateTreatment = {
  id: 29240,
};

export const sampleWithPartialData: IPreEstimateTreatment = {
  id: 10510,
  vehicleTreatmentID: 'mockingly sit',
  paintName: 'bungalow roger against',
  other: 'likely shady',
  sh: 'SH',
  unitPrice: 15296.82,
  price: 14102.44,
  isSystemPrice: true,
  availableQuantity: 4767,
  opsUnitID: 'arbitrate sick euphonium',
  createdBy: 'excepting notwithstanding after',
  createdDate: dayjs('2025-04-25T23:04'),
  lastModifiedBy: 'for',
  lastModifiedDate: dayjs('2025-04-25T12:12'),
};

export const sampleWithFullData: IPreEstimateTreatment = {
  id: 32255,
  vehicleTreatmentID: 'fraternise mask whether',
  fittingChargeName: 'empty aw',
  paintName: 'aside apud drat',
  partName: 'prohibition pasta',
  partNumber: 'considering controvert',
  repairName: 'petal finally',
  other: 'speedily',
  sh: 'SH',
  marketPrice: 25792.78,
  priceType: 'ESTIMATE',
  type: 'overspend hence',
  customPrice: 'fishery whenever',
  unitPrice: 17157.73,
  price: 14216.64,
  totalPrice: 31194.43,
  isSystemPrice: true,
  availableQuantity: 22470,
  treatmentType: 'PART',
  quantity: 28341.52,
  opsUnitID: 'besides louse waver',
  createdBy: 'irk',
  createdDate: dayjs('2025-04-25T17:14'),
  lastModifiedBy: 'duh colossal and',
  lastModifiedDate: dayjs('2025-04-25T20:06'),
};

export const sampleWithNewData: NewPreEstimateTreatment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
