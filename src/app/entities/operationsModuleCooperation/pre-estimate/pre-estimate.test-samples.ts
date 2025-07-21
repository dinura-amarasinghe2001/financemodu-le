import dayjs from 'dayjs/esm';

import { IPreEstimate, NewPreEstimate } from './pre-estimate.model';

export const sampleWithRequiredData: IPreEstimate = {
  id: 28356,
};

export const sampleWithPartialData: IPreEstimate = {
  id: 29299,
  vehicleID: 'why ingratiate so',
  vehicleModel: 'at',
  vehicleOwnerID: 'outrank yippee',
  numberOfPanels: 20315,
  isInsurance: true,
  insuranceID: 'before bright accessorise',
  opsUnitID: 'near',
  createdBy: 'kissingly',
};

export const sampleWithFullData: IPreEstimate = {
  id: 25164,
  vehicleID: 'jovially disapprove provider',
  vehicleBrand: 'aboard',
  vehicleModel: 'midst regal despite',
  licenseNo: 'futon orient',
  vehicleOwnerID: 'grouchy',
  vehicleOwnerName: 'meager',
  vehicleOwnerContactNumber1: 'pity uselessly',
  vehicleOwnerContactNumber2: 'bob',
  preEstimateNumber: 'powerful own and',
  numberOfPanels: 5716,
  jobType: 18142,
  isInsurance: false,
  insuranceName: 'pace',
  insuranceID: 'tenderly',
  opsUnitID: 'rubric',
  createdBy: 'weary',
  createdDate: dayjs('2025-04-26T04:59'),
  lastModifiedBy: 'of',
  lastModifiedDate: dayjs('2025-04-25T20:37'),
};

export const sampleWithNewData: NewPreEstimate = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
