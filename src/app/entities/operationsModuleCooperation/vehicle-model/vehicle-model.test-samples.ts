import dayjs from 'dayjs/esm';

import { IVehicleModel, NewVehicleModel } from './vehicle-model.model';

export const sampleWithRequiredData: IVehicleModel = {
  id: 14376,
};

export const sampleWithPartialData: IVehicleModel = {
  id: 4643,
  description: 'gadzooks yowza what',
  createdBy: 'after besides circa',
  createdDate: dayjs('2025-04-06T13:05'),
  lastModifiedBy: 'apropos',
  lastModifiedDate: dayjs('2025-04-06T10:07'),
};

export const sampleWithFullData: IVehicleModel = {
  id: 31388,
  modelName: 'likewise',
  description: 'steel bah tributary',
  opsUnitID: 'navigate mature little',
  createdBy: 'certainly',
  createdDate: dayjs('2025-04-06T06:32'),
  lastModifiedBy: 'onset',
  lastModifiedDate: dayjs('2025-04-06T16:56'),
};

export const sampleWithNewData: NewVehicleModel = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
