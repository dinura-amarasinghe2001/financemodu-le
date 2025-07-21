import dayjs from 'dayjs/esm';

import { IGatePass, NewGatePass } from './gate-pass.model';

export const sampleWithRequiredData: IGatePass = {
  id: 13780,
};

export const sampleWithPartialData: IGatePass = {
  id: 32424,
  vehicleBrand: 'perfectly ferociously airbus',
  vehicleModel: 'splurge um',
  vehicleLicenseNumber: 'uproot consequently',
  vehicleOwnerContactNumber1: 'however knavishly next',
  sideLView1: 'lucky masterpiece how',
  rearView1: 'oh finally',
  ownerBelongings: 'abaft',
  createdBy: 'red',
  createdDate: dayjs('2025-04-07T07:19'),
  lastModifiedBy: 'delightfully',
  lastModifiedDate: dayjs('2025-04-07T20:05'),
};

export const sampleWithFullData: IGatePass = {
  id: 32753,
  vehicleID: 'duh',
  vehicleBrand: 'issue once',
  vehicleModel: 'fragrant out',
  vehicleLicenseNumber: 'how',
  vehicleOwnerID: 'seemingly',
  vehicleOwnerName: 'harangue',
  vehicleOwnerContactNumber1: 'triumphantly gadzooks nor',
  vehicleOwnerContactNumber2: 'ew micromanage',
  fuelLevel: 'grumpy',
  meterReading: 'likewise',
  status: 'ONGOING',
  frontView1: 'given',
  sideRView1: 'although',
  sideLView1: 'bookend like grouper',
  rearView1: 'intensely anenst deer',
  jobCardNumber: 'after bookend often',
  receiptValue: 13220.9,
  entryDateTime: dayjs('2025-04-07T14:10'),
  opsUnitID: 'generally',
  invoiceNumber: 'pish supposing',
  ownerBelongings: 'warm through',
  createdBy: 'doorpost toaster',
  createdDate: dayjs('2025-04-07T01:39'),
  lastModifiedBy: 'immediately',
  lastModifiedDate: dayjs('2025-04-07T01:19'),
};

export const sampleWithNewData: NewGatePass = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
