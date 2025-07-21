import dayjs from 'dayjs/esm';

import { IInvoicePayments, NewInvoicePayments } from './invoice-payments.model';

export const sampleWithRequiredData: IInvoicePayments = {
  id: 7983,
};

export const sampleWithPartialData: IInvoicePayments = {
  id: 8438,
  createdBy: 'unkempt ouch',
};

export const sampleWithFullData: IInvoicePayments = {
  id: 14154,
  paymentType: 'rudely where lest',
  amount: 22179.68,
  createdBy: 'hydrocarbon famously furthermore',
  createdDate: dayjs('2025-05-04T09:21'),
  lastModifiedBy: 'far',
  lastModifiedDate: dayjs('2025-05-05T07:22'),
};

export const sampleWithNewData: NewInvoicePayments = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
