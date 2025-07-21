import dayjs from 'dayjs/esm';

import { IFlag, NewFlag } from './flag.model';

export const sampleWithRequiredData: IFlag = {
  id: 28681,
};

export const sampleWithPartialData: IFlag = {
  id: 10377,
  description: 'amongst whoa cricket',
  createdDate: dayjs('2025-04-01T23:45'),
};

export const sampleWithFullData: IFlag = {
  id: 26387,
  code: '1e0da2c1-d24e-4906-8b65-ec2ec645c515',
  flagId: 'confiscate abaft holster',
  flagName: 'gah',
  flagValue: true,
  description: 'absent inside',
  isDeleted: true,
  createdBy: 'ew mallard',
  createdDate: dayjs('2025-04-02T07:12'),
  lastModifiedBy: 'now bliss',
  lastModifiedDate: dayjs('2025-04-01T16:02'),
};

export const sampleWithNewData: NewFlag = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
