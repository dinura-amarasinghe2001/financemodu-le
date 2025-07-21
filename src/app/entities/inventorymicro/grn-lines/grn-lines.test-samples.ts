import dayjs from 'dayjs/esm';

import { IGRNLines, NewGRNLines } from './grn-lines.model';

export const sampleWithRequiredData: IGRNLines = {
  id: 30919,
};

export const sampleWithPartialData: IGRNLines = {
  id: 10054,
  itemCode: 'up variable',
  unitOfMeasurement: 'considering hm until',
  price: 3977.03,
  totalAmount: 24598.23,
  passQty: 13547.68,
  currentReceivedQty: 29871.09,
  totalPassedQty: 27261.55,
  isInventoryUpdate: false,
  inventoryQty: 6910.19,
};

export const sampleWithFullData: IGRNLines = {
  id: 19647,
  grnId: 32445,
  lineId: 27973,
  itemId: 18869,
  itemCode: 'notwithstanding swordfish huzzah',
  itemName: 'ah loyalty',
  description: 'humor',
  unitOfMeasurement: 'mash needy',
  quantity: 14106.23,
  receivedQuantity: 19698.65,
  price: 28220.8,
  totalAmount: 514.72,
  lineTotal: 4591.92,
  lmu: 13345,
  lmd: dayjs('2025-06-06T15:45'),
  inspected: false,
  passQty: 1451.21,
  currentReceivedQty: 21481.43,
  totalPassedQty: 15231.82,
  isInventoryUpdate: false,
  inventoryQty: 30862.87,
  totalInventoryQty: 26639.73,
};

export const sampleWithNewData: NewGRNLines = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
