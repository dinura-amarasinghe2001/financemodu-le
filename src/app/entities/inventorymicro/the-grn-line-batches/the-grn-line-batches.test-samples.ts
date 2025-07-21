import dayjs from 'dayjs/esm';

import { ITheGRNLineBatches, NewTheGRNLineBatches } from './the-grn-line-batches.model';

export const sampleWithRequiredData: ITheGRNLineBatches = {
  id: 23486,
};

export const sampleWithPartialData: ITheGRNLineBatches = {
  id: 29778,
  lineId: 22566,
  itemId: 13503,
  qty: 32461.07,
  cost: 27372.48,
  price: 16801.14,
  costWithoutVat: 2092.47,
  priceWithoutVat: 24109.58,
  notes: 'ew',
  lmd: dayjs('2025-06-16T17:26'),
  batchId: 22084,
  batchLineTotal: 90.69,
  inspected: true,
  totalPassedQty: 26180.11,
  isInventoryUpdate: true,
  inventoryQty: 14743.51,
  returnPrice: 14311.04,
};

export const sampleWithFullData: ITheGRNLineBatches = {
  id: 16539,
  grnId: 21322,
  lineId: 5897,
  batchLineId: 24649,
  itemId: 31426,
  code: 'why phooey',
  txDate: dayjs('2025-06-16T10:34'),
  manufactureDate: dayjs('2025-06-16T21:42'),
  expiredDate: dayjs('2025-06-16T13:47'),
  qty: 32649.07,
  cost: 31140.72,
  price: 22682.9,
  costWithoutVat: 722.26,
  priceWithoutVat: 10556.32,
  hasVat: true,
  supplierDiscount: 9220.46,
  notes: 'supposing ick',
  lmu: 4993,
  lmd: dayjs('2025-06-16T18:19'),
  batchId: 4897,
  qtyIn: 19312.34,
  qtyOut: 22284.15,
  batchLineTotal: 24274.38,
  inspected: false,
  passQty: 17615.53,
  currentReceivedQty: 23062.25,
  totalPassedQty: 9371.4,
  isInventoryUpdate: true,
  inventoryQty: 28858.89,
  totalInventoryQty: 13483.71,
  returnPrice: 24648.76,
};

export const sampleWithNewData: NewTheGRNLineBatches = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
