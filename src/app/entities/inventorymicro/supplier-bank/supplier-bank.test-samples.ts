import dayjs from 'dayjs/esm';

import { ISupplierBank, NewSupplierBank } from './supplier-bank.model';

export const sampleWithRequiredData: ISupplierBank = {
  id: 2039,
};

export const sampleWithPartialData: ISupplierBank = {
  id: 12398,
  creditPeriod: 16243,
  maximumDiscount: 9056.96,
  cash: false,
};

export const sampleWithFullData: ISupplierBank = {
  id: 3802,
  creditPeriod: 9172,
  maximumDiscount: 20827.12,
  maximumCreditLimit: 32703.16,
  chequeDrawn: 'fussy aw whenever',
  cash: false,
  lmd: dayjs('2025-06-04T03:13'),
  lmu: 'so different pink',
};

export const sampleWithNewData: NewSupplierBank = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
