import dayjs from 'dayjs/esm';

import { IVehicleTreatmentRegistry, NewVehicleTreatmentRegistry } from './vehicle-treatment-registry.model';

export const sampleWithRequiredData: IVehicleTreatmentRegistry = {
  id: 5388,
};

export const sampleWithPartialData: IVehicleTreatmentRegistry = {
  id: 13166,
  paintName: 'hoarse provided pro',
  description: 'cap',
  availableQuantity: 14711,
  price: 31098.52,
  treatmentType: 'PAINT',
  createdBy: 'cosset whether than',
  createdDate: dayjs('2025-04-26T00:11'),
};

export const sampleWithFullData: IVehicleTreatmentRegistry = {
  id: 29284,
  fittingChargeName: 'drat thankfully',
  paintName: 'lest',
  partName: 'empty qua',
  repairName: 'sternly',
  otherName: 'extroverted woot low',
  description: 'explode gee upright',
  partNumber: 'shore',
  availableQuantity: 20879,
  price: 25778.18,
  treatmentType: 'PAINT',
  opsUnitID: 'reward sin indeed',
  createdBy: 'upside-down',
  createdDate: dayjs('2025-04-25T21:02'),
  lastModifiedBy: 'vamoose spark printer',
  lastModifiedDate: dayjs('2025-04-25T05:26'),
};

export const sampleWithNewData: NewVehicleTreatmentRegistry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
