import dayjs from 'dayjs/esm';

import { ITenant, NewTenant } from './tenant.model';

export const sampleWithRequiredData: ITenant = {
  id: 32514,
};

export const sampleWithPartialData: ITenant = {
  id: 9712,
  name: 'language velvety',
  displayName: 'vacantly fair',
  description: 'whoa',
  active: false,
  establishedDate: dayjs('2025-04-01'),
  createdBy: 'aboard',
  createdDate: dayjs('2025-04-02T01:07'),
  lastModifiedBy: 'that when',
  lastModifiedDate: dayjs('2025-04-01T14:50'),
};

export const sampleWithFullData: ITenant = {
  id: 4480,
  code: '01eda57e-37ab-4757-8912-43134ccd4e0c',
  name: 'baptise jubilant',
  displayName: 'ha eek',
  tenantType: 'SME',
  levelType: 'DEPARTMENT',
  levelStatus: 'UNDER_MAINTENANCE',
  registrationNumber: 'cleverly',
  taxId: 'uh-huh',
  description: 'symbolise including stupendous',
  active: false,
  establishedDate: dayjs('2025-04-01'),
  website: 'grouchy',
  logo: 'delicious fantastic',
  createdBy: 'whoa',
  createdDate: dayjs('2025-04-02T04:21'),
  lastModifiedBy: 'cone',
  lastModifiedDate: dayjs('2025-04-01T15:40'),
};

export const sampleWithNewData: NewTenant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
