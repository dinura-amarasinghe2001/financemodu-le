import dayjs from 'dayjs/esm';

import { ITheInventoryBatches, NewTheInventoryBatches } from './the-inventory-batches.model';

export const sampleWithRequiredData: ITheInventoryBatches = {
  id: 31035,
};

export const sampleWithPartialData: ITheInventoryBatches = {
  id: 13077,
  itemId: 5687,
  grnId: 27450,
  txDate: dayjs('2025-06-16T17:43'),
  price: 17423.61,
  costWithoutVat: 11552.36,
  notes: 'how alongside skateboard',
  addedDate: dayjs('2025-06-16T17:49'),
  returnPrice: 111.97,
};

export const sampleWithFullData: ITheInventoryBatches = {
  id: 10118,
  itemId: 30555,
  grnId: 13586,
  code: 'dapper',
  txDate: dayjs('2025-06-16T19:27'),
  cost: 6343.23,
  price: 31994.28,
  costWithoutVat: 25750.41,
  priceWithoutVat: 19947.41,
  notes: 'singing',
  lmu: 16380,
  lmd: dayjs('2025-06-16T17:41'),
  lineId: 29637,
  manufactureDate: dayjs('2025-06-17T02:31'),
  expireDate: dayjs('2025-06-16T13:02'),
  quantity: 12636.29,
  addedDate: dayjs('2025-06-16T17:01'),
  costTotal: 6623.47,
  returnPrice: 21307.08,
};

export const sampleWithNewData: NewTheInventoryBatches = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
