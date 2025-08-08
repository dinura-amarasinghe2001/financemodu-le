import dayjs from 'dayjs/esm';

import { IAccountType, NewAccountType } from './account-type.model';

export const sampleWithRequiredData: IAccountType = {
  id: 28333,
};

export const sampleWithPartialData: IAccountType = {
  id: 10747,
  opsUnitID: 'simplistic upon',
};

export const sampleWithFullData: IAccountType = {
  id: 24195,
  opsUnitID: 'futon pretty',
  type: 'qualified across',
  code: 'athwart vicinity coordinated',
  lmu: 'lighthearted',
  lmd: dayjs('2025-07-22T22:51'),
  accountTypeValue: 24237.88,
  canEdit: false,
};

export const sampleWithNewData: NewAccountType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
