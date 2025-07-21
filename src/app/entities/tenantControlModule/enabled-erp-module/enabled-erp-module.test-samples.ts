import dayjs from 'dayjs/esm';

import { IEnabledERPModule, NewEnabledERPModule } from './enabled-erp-module.model';

export const sampleWithRequiredData: IEnabledERPModule = {
  id: 1801,
};

export const sampleWithPartialData: IEnabledERPModule = {
  id: 3673,
  moduleName: 'cannon birth babushka',
  moduleCode: '4da6f051-a68f-448d-890c-816fb36067df',
  description: 'pish hm',
  createdBy: 'outgoing passionate yahoo',
  lastModifiedBy: 'decouple ski frenetically',
  lastModifiedDate: dayjs('2025-04-02T10:14'),
};

export const sampleWithFullData: IEnabledERPModule = {
  id: 12431,
  moduleName: 'blissfully elevator unfinished',
  moduleCode: '5a03ba7d-7471-48eb-8ff0-8dd7d1045756',
  description: 'inspect formula chairperson',
  createdBy: 'amongst out while',
  createdDate: dayjs('2025-04-01T13:58'),
  lastModifiedBy: 'ack mediocre',
  lastModifiedDate: dayjs('2025-04-01T13:25'),
};

export const sampleWithNewData: NewEnabledERPModule = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
