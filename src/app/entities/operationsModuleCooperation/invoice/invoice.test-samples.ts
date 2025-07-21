import dayjs from 'dayjs/esm';

import { IInvoice, NewInvoice } from './invoice.model';

export const sampleWithRequiredData: IInvoice = {
  id: 29050,
};

export const sampleWithPartialData: IInvoice = {
  id: 4844,
  vehicleBrand: 'parody catalyst hollow',
  vehicleOwnerContactNumber1: 'quietly',
  vehicleOwnerContactNumber2: 'times',
  totalAmount: 23948.39,
  vatAmount: 5702.7,
  invoiceStatus: 'PAID',
};

export const sampleWithFullData: IInvoice = {
  id: 19628,
  vehicleID: 'yesterday times',
  vehicleBrand: 'on',
  vehicleModel: 'shampoo uh-huh gorgeous',
  vehicleLicenseNumber: 'concerned meanwhile',
  vehicleOwnerID: 'oof fiddle',
  vehicleOwnerName: 'gosh hover till',
  vehicleOwnerContactNumber1: 'deflect astride',
  vehicleOwnerContactNumber2: 'nor who',
  jobID: 'incidentally sedately accidentally',
  totalNetAmount: 11058.41,
  discountRate: 25531.57,
  discountAmount: 21897.22,
  totalAmount: 25015.57,
  netTotalAmount: 22304.94,
  vatAmount: 19575.44,
  customerVATNumber: 'academics daddy',
  invoiceDate: dayjs('2025-04-25T18:48'),
  invoiceStatus: 'PAID',
};

export const sampleWithNewData: NewInvoice = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
