import dayjs from 'dayjs/esm';

import { IInvoiceItem, NewInvoiceItem } from './invoice-item.model';

export const sampleWithRequiredData: IInvoiceItem = {
  id: 29900,
};

export const sampleWithPartialData: IInvoiceItem = {
  id: 24637,
  descriptions: 'now jealous minus',
  amount: 24057.03,
  types: 'gah',
};

export const sampleWithFullData: IInvoiceItem = {
  id: 20248,
  invoiceDate: dayjs('2025-04-26T00:57'),
  descriptions: 'follower',
  amount: 4948.14,
  types: 'pacemaker',
};

export const sampleWithNewData: NewInvoiceItem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
