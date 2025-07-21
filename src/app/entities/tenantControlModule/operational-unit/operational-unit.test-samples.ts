import dayjs from 'dayjs/esm';

import { IOperationalUnit, NewOperationalUnit } from './operational-unit.model';

export const sampleWithRequiredData: IOperationalUnit = {
  id: 15482,
};

export const sampleWithPartialData: IOperationalUnit = {
  id: 3124,
  code: '589a758e-d2a5-47a4-bf04-68c979e1b868',
  displayName: 'onto whose up',
  levelBusinessType: 'EDUCATIONAL',
  contactPhone: 'idolized yowza blissfully',
  immediateParentCode: 'psst underneath',
  levelType: 'BRANCH',
  createdDate: dayjs('2025-04-01T16:20'),
  lastModifiedDate: dayjs('2025-04-01T15:31'),
};

export const sampleWithFullData: IOperationalUnit = {
  id: 2795,
  code: '9f9d8e9a-a71c-457d-896c-c0e805ff982a',
  name: 'after equally',
  displayName: 'pace',
  levelBusinessType: 'SME',
  remark: 'opposite',
  description: 'brr viciously',
  contactEmail: 'ah secrecy of',
  contactPhone: 'toward construe what',
  immediateParentCode: 'hence gee undergo',
  levelType: 'TEAM',
  createdBy: 'weakly',
  createdDate: dayjs('2025-04-02T02:10'),
  lastModifiedBy: 'prime',
  lastModifiedDate: dayjs('2025-04-01T22:41'),
};

export const sampleWithNewData: NewOperationalUnit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
