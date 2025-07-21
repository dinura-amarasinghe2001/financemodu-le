import dayjs from 'dayjs/esm';

import { IBinCard, NewBinCard } from './bin-card.model';

export const sampleWithRequiredData: IBinCard = {
  id: 17726,
};

export const sampleWithPartialData: IBinCard = {
  id: 22081,
  qtyIn: 4889.88,
  qtyOut: 30788.77,
  referenceCode: 'astride as',
  recordDate: dayjs('2025-06-08T08:51'),
  batchId: 'partial gadzooks happily',
  opening: 26287.98,
  referenceDoc: 'hence waist uncomfortable',
};

export const sampleWithFullData: IBinCard = {
  id: 15481,
  itemId: 762,
  itemCode: 'who institutionalize victoriously',
  reference: 'worriedly behind',
  txDate: dayjs('2025-06-08T08:08'),
  qtyIn: 11966.07,
  qtyOut: 12205.65,
  price: 26790.06,
  lmu: 'once sympathetically',
  lmd: dayjs('2025-06-09T03:28'),
  referenceCode: 'justly bouncy',
  recordDate: dayjs('2025-06-08T15:19'),
  batchId: 'indeed mmm',
  locationId: 32046,
  locationCode: 'duh blah',
  opening: 26207.61,
  description: 'beyond filter',
  referenceDoc: 'woeful lovable carnival',
};

export const sampleWithNewData: NewBinCard = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
