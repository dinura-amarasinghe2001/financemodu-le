import dayjs from 'dayjs/esm';

import { IGRN, NewGRN } from './grn.model';

export const sampleWithRequiredData: IGRN = {
  id: 2425,
};

export const sampleWithPartialData: IGRN = {
  id: 7527,
  grnDate: dayjs('2025-06-06T12:04'),
  supplierAddress: 'shy sardonic',
  invoiceId: 27813,
  invoiceCode: 'ouch illustrious arrogantly',
  subTotal: 17266.75,
  amountOwing: 32033.59,
  orderId: 22855,
  isAccountSectionChecked: true,
  supplierDiscount: 4712.75,
};

export const sampleWithFullData: IGRN = {
  id: 11663,
  grnCode: 'yahoo boo',
  grnDate: dayjs('2025-06-06T16:55'),
  poNum: 'vulgarise',
  supplierId: 32013,
  supplierName: 'pretend over but',
  supplierAddress: 'but',
  invoiceId: 28827,
  invoiceCode: 'chilly meanwhile fort',
  subTotal: 25089.2,
  lmu: 14832,
  lmd: dayjs('2025-06-06T16:56'),
  amountOwing: 25818.81,
  isActive: true,
  inspected: false,
  orderId: 31772,
  supplierInvoiceCode: 'advocate ha',
  isAccountSectionChecked: false,
  total: 12113,
  isInventoryUpdated: true,
  comments: 'viciously never',
  supplierInvoiceDate: dayjs('2025-06-06T12:44'),
  supplierDiscount: 5135.17,
};

export const sampleWithNewData: NewGRN = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
