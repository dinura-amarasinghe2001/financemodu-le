import dayjs from 'dayjs/esm';

import { IBrand, NewBrand } from './brand.model';

export const sampleWithRequiredData: IBrand = {
  id: 20780,
};

export const sampleWithPartialData: IBrand = {
  id: 25799,
  createdBy: 'however when outside',
  createdDate: dayjs('2025-04-07T03:43'),
  lastModifiedBy: 'stump',
  lastModifiedDate: dayjs('2025-04-06T20:48'),
};

export const sampleWithFullData: IBrand = {
  id: 9187,
  brandName: 'er',
  description: 'shell drum',
  opsUnitID: 'eek',
  emblem: 'outrageous',
  createdBy: 'that',
  createdDate: dayjs('2025-04-07T02:59'),
  lastModifiedBy: 'foolishly',
  lastModifiedDate: dayjs('2025-04-07T01:27'),
};

export const sampleWithNewData: NewBrand = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
