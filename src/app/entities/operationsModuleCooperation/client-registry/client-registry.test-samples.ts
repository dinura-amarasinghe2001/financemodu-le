import dayjs from 'dayjs/esm';

import { IClientRegistry, NewClientRegistry } from './client-registry.model';

export const sampleWithRequiredData: IClientRegistry = {
  id: 13110,
};

export const sampleWithPartialData: IClientRegistry = {
  id: 28549,
  name: 'yuck monthly',
  lastVehicleID: 'quip between',
  contactNumber1: 'sweetly',
  opsUnitID: 'trusting mmm swiftly',
  createdBy: 'irresponsible after above',
  createdDate: dayjs('2025-04-06T13:38'),
  lastModifiedBy: 'deadly yahoo',
};

export const sampleWithFullData: IClientRegistry = {
  id: 22208,
  name: 'readily eternity',
  lastVehicleID: 'ouch geez ocelot',
  lastReceiptID: 'hmph under',
  address: 'acidly',
  city: "O'Reillybury",
  contactNumber1: 'wring',
  contactNumber2: 'phew gah',
  email: 'Leann.Runolfsdottir@hotmail.com',
  opsUnitID: 'cook drat aha',
  createdBy: 'straw',
  createdDate: dayjs('2025-04-06T18:07'),
  lastModifiedBy: 'ha',
  lastModifiedDate: dayjs('2025-04-07T03:26'),
};

export const sampleWithNewData: NewClientRegistry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
