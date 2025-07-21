import dayjs from 'dayjs/esm';

import { IInventoryBatches, NewInventoryBatches } from './inventory-batches.model';

export const sampleWithRequiredData: IInventoryBatches = {
  id: 4629,
};

export const sampleWithPartialData: IInventoryBatches = {
  id: 26552,
  code: 'including jiggle yuck',
  costWithoutVat: 27973.31,
  notes: 'patroller repentant',
  lmd: dayjs('2025-06-08T02:15'),
  manufactureDate: dayjs('2025-06-07T08:50'),
  expireDate: dayjs('2025-06-07T15:22'),
};

export const sampleWithFullData: IInventoryBatches = {
  id: 30340,
  itemId: 2066,
  code: 'jubilantly',
  txDate: dayjs('2025-06-07T05:53'),
  cost: 26303.04,
  price: 16180.37,
  costWithoutVat: 31867.72,
  priceWithoutVat: 27129.64,
  notes: 'including',
  lmu: 20801,
  lmd: dayjs('2025-06-08T04:59'),
  lineId: 2904,
  manufactureDate: dayjs('2025-06-07T07:04'),
  expireDate: dayjs('2025-06-07T10:53'),
  quantity: 21620.74,
  addedDate: dayjs('2025-06-07T06:47'),
  costTotal: 885.58,
  returnPrice: 29474.25,
};

export const sampleWithNewData: NewInventoryBatches = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
