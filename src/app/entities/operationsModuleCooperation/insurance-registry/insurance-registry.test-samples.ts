import dayjs from 'dayjs/esm';

import { IInsuranceRegistry, NewInsuranceRegistry } from './insurance-registry.model';

export const sampleWithRequiredData: IInsuranceRegistry = {
  id: 22045,
};

export const sampleWithPartialData: IInsuranceRegistry = {
  id: 18717,
  remark: 'physically stunt before',
  createdBy: 'weary mouser through',
  lastModifiedBy: 'drat hungrily gah',
  lastModifiedDate: dayjs('2025-04-06T20:01'),
};

export const sampleWithFullData: IInsuranceRegistry = {
  id: 22754,
  insuranceName: 'proper eek misjudge',
  remark: 'accredit',
  hotline: 'sonnet snarling circa',
  opsUnitID: 'though',
  createdBy: 'wedge',
  createdDate: dayjs('2025-04-06T19:33'),
  lastModifiedBy: 'which lace',
  lastModifiedDate: dayjs('2025-04-06T10:10'),
};

export const sampleWithNewData: NewInsuranceRegistry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
