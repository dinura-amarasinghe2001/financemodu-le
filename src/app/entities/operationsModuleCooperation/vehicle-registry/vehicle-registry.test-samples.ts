import dayjs from 'dayjs/esm';

import { IVehicleRegistry, NewVehicleRegistry } from './vehicle-registry.model';

export const sampleWithRequiredData: IVehicleRegistry = {
  id: 20981,
};

export const sampleWithPartialData: IVehicleRegistry = {
  id: 21540,
  yom: 'coexist queasy',
  brand: 'ew alongside',
  brandID: 'ouch lest babushka',
  modelNumber: 'decisive',
};

export const sampleWithFullData: IVehicleRegistry = {
  id: 29224,
  licenseNo: 'ligate boohoo',
  yom: 'awful',
  brand: 'watery fooey conversation',
  model: 'emotional',
  brandID: 'oh who separately',
  modelID: 'wonderful highly',
  modelNumber: 'vain',
  opsUnitID: 'but blind',
  createdBy: 'trusty honestly brave',
  createdDate: dayjs('2025-04-07T02:10'),
  lastModifiedBy: 'convince because treasure',
  lastModifiedDate: dayjs('2025-04-07T01:55'),
};

export const sampleWithNewData: NewVehicleRegistry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
