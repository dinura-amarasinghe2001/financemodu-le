import dayjs from 'dayjs/esm';

import { IInventory, NewInventory } from './inventory.model';

export const sampleWithRequiredData: IInventory = {
  id: 19402,
};

export const sampleWithPartialData: IInventory = {
  id: 28204,
  code: 'gadzooks whose bonfire',
  classification1: 'worriedly',
  classification2: 'optimistically',
  classification3: 'during opposite',
  classification4: 'infinite',
  classification5: 'meaningfully glorious arrogantly',
  assemblyUnitOf: 2361,
  reOrderLevel: 27452.27,
  lastSellingPrice: 20590.22,
  lmu: 30939,
  itemSpecFilePath: 'sniff up',
  minStock: 17645.8,
  accountId: 11351,
  casePackQty: 25567,
  isRegistered: false,
  rackNo: 'hmph meh',
  reOrderQty: 9761.33,
};

export const sampleWithFullData: IInventory = {
  id: 6719,
  code: 'cleverly poppy',
  partNumber: 'motor seriously',
  name: 'entwine apropos',
  description: 'deceivingly gnaw',
  type: 26596,
  classification1: 'as stunning warlike',
  classification2: 'actual',
  classification3: 'aged yuck',
  classification4: 'past finally',
  classification5: 'spirit debit',
  unitOfMeasurement: 'honestly brr ugh',
  decimalPlaces: 12340,
  isAssemblyUnit: false,
  assemblyUnitOf: 7876,
  reOrderLevel: 3773.7,
  lastCost: 27084.99,
  lastSellingPrice: 32142.38,
  lmu: 6058,
  lmd: dayjs('2025-06-07T06:08'),
  availableQuantity: 32737.42,
  hasBatches: false,
  itemSpecFilePath: 'mmm design',
  itemImagePath: 'impartial',
  returnPrice: 13381.07,
  activeItem: true,
  minStock: 27932.95,
  maxStock: 14349.96,
  dailyAverage: 23714.48,
  bufferLevel: 9802.22,
  leadTime: 19198.77,
  bufferTime: 15157.85,
  saftyDays: 31776.72,
  accountCode: 'astride gnash yahoo',
  accountId: 27464,
  casePackQty: 31084,
  isRegistered: true,
  defaultStockLocationId: 4543,
  rackNo: 'almost',
  commissionEmpId: 16823,
  checkTypeId: 665,
  checkType: 'recent submissive',
  reOrderQty: 26330.33,
  notInInvoice: true,
};

export const sampleWithNewData: NewInventory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
