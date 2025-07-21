import dayjs from 'dayjs/esm';

import { IJobEstimate, NewJobEstimate } from './job-estimate.model';

export const sampleWithRequiredData: IJobEstimate = {
  id: 2159,
};

export const sampleWithPartialData: IJobEstimate = {
  id: 823,
  jobID: 'ravage unsteady',
  departmentID: 'amid',
  endDate: dayjs('2025-04-25T05:58'),
  currentState: 'OPEN',
  remarks: 'lest',
  estStartDate: dayjs('2025-04-25T09:25'),
  estimateID: 'certainly',
  vehicleLicenseNumber: 'honesty while communicate',
  createdBy: 'wholly ha scratch',
  createdDate: dayjs('2025-04-26T00:50'),
  lastModifiedDate: dayjs('2025-04-26T03:31'),
};

export const sampleWithFullData: IJobEstimate = {
  id: 660,
  jobID: 'hence to',
  departmentID: 'sermon among',
  startDate: dayjs('2025-04-25T10:31'),
  endDate: dayjs('2025-04-26T03:20'),
  currentState: 'QC_APPROVED',
  remarks: 'oh considering whose',
  estStartDate: dayjs('2025-04-25T12:22'),
  estEndDate: dayjs('2025-04-25T23:55'),
  opsUnitID: 'cow fashion bump',
  estimateID: 'elevation',
  vehicleLicenseNumber: 'coliseum suitcase',
  createdBy: 'humble ouch collaborate',
  createdDate: dayjs('2025-04-25T13:03'),
  lastModifiedBy: 'even',
  lastModifiedDate: dayjs('2025-04-26T01:08'),
};

export const sampleWithNewData: NewJobEstimate = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
