import dayjs from 'dayjs/esm';

import { IJobItemTimeEstimation, NewJobItemTimeEstimation } from './job-item-time-estimation.model';

export const sampleWithRequiredData: IJobItemTimeEstimation = {
  id: 23031,
};

export const sampleWithPartialData: IJobItemTimeEstimation = {
  id: 21531,
  startDateTime: dayjs('2025-04-06T19:03'),
  endDateTime: dayjs('2025-04-06T14:25'),
  jobItemType: 'QC',
  opsUnitID: 'finally ugh',
  lastModifiedBy: 'if gerbil',
  lastModifiedDate: dayjs('2025-04-06T12:17'),
};

export const sampleWithFullData: IJobItemTimeEstimation = {
  id: 172,
  startDateTime: dayjs('2025-04-06T06:21'),
  endDateTime: dayjs('2025-04-06T09:13'),
  remark: 'wholly gym',
  jobItemType: 'SALES',
  opsUnitID: 'bah',
  createdBy: 'publication',
  createdDate: dayjs('2025-04-06T18:44'),
  lastModifiedBy: 'yippee screw shameless',
  lastModifiedDate: dayjs('2025-04-06T19:37'),
};

export const sampleWithNewData: NewJobItemTimeEstimation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
