import dayjs from 'dayjs/esm';

import { IGRNLineBatches, NewGRNLineBatches } from './grn-line-batches.model';

export const sampleWithRequiredData: IGRNLineBatches = {
  id: 32108,
};

export const sampleWithPartialData: IGRNLineBatches = {
  id: 28726,
  itemId: 13879,
  code: 'absentmindedly opposite',
  txDate: dayjs('2025-06-07T05:55'),
  manufactureDate: dayjs('2025-06-06T15:20'),
  qty: 1587.41,
  cost: 10255.81,
  price: 6916.02,
  costWithoutVat: 5268.46,
  qtyIn: 14102.87,
  inspected: false,
  passQty: 27204.9,
  currentReceivedQty: 3159.54,
  isInventoryUpdate: false,
  inventoryQty: 15426.26,
  totalInventoryQty: 12382.93,
};

export const sampleWithFullData: IGRNLineBatches = {
  id: 25683,
  lineId: 18227,
  batchLineId: 9806,
  itemId: 30838,
  code: 'minister',
  txDate: dayjs('2025-06-07T03:38'),
  manufactureDate: dayjs('2025-06-06T14:52'),
  expiredDate: dayjs('2025-06-07T02:47'),
  qty: 17359.95,
  cost: 28868.85,
  price: 18483.94,
  costWithoutVat: 7148.67,
  priceWithoutVat: 22247.81,
  hasVat: false,
  supplierDiscount: 4114.32,
  notes: 'rejoin blah',
  lmu: 6454,
  lmd: dayjs('2025-06-06T10:47'),
  batchId: 30135,
  qtyIn: 2503.83,
  qtyOut: 16509.46,
  batchLineTotal: 27312.29,
  inspected: true,
  passQty: 18400.63,
  currentReceivedQty: 1894.25,
  totalPassedQty: 8000.38,
  isInventoryUpdate: false,
  inventoryQty: 27242.78,
  totalInventoryQty: 2727.68,
  returnPrice: 2422.51,
};

export const sampleWithNewData: NewGRNLineBatches = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
