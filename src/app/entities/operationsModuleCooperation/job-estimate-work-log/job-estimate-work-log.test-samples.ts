import dayjs from 'dayjs/esm';

import { IJobEstimateWorkLog, NewJobEstimateWorkLog } from './job-estimate-work-log.model';

export const sampleWithRequiredData: IJobEstimateWorkLog = {
  id: 24014,
};

export const sampleWithPartialData: IJobEstimateWorkLog = {
  id: 26545,
  workDate: dayjs('2025-04-30T02:08'),
  createdBy: 'atrium',
  createdDate: dayjs('2025-04-30T00:01'),
  lastModifiedBy: 'inside emphasise once',
  lastModifiedDate: dayjs('2025-04-29T21:38'),
};

export const sampleWithFullData: IJobEstimateWorkLog = {
  id: 19257,
  workedEmployeeName: 'odd interior not',
  workedHours: 27395.47,
  workDate: dayjs('2025-04-29T14:16'),
  createdBy: 'boo decisive fit',
  createdDate: dayjs('2025-04-29T22:43'),
  lastModifiedBy: 'sick',
  lastModifiedDate: dayjs('2025-04-29T12:22'),
};

export const sampleWithNewData: NewJobEstimateWorkLog = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
