import dayjs from 'dayjs/esm';

import { IEstimate, NewEstimate } from './estimate.model';

export const sampleWithRequiredData: IEstimate = {
  id: 19197,
};

export const sampleWithPartialData: IEstimate = {
  id: 28203,
  vehicleID: 'obsess preregister',
  licenseNo: 'drum esteemed',
  vehicleOwnerContactNumber1: 'superficial',
  isInsurance: false,
  insuranceName: 'lotion misjudge preclude',
  insuranceID: 'traffic',
  opsUnitID: 'or',
  totalPrice: 8095.11,
  preEstimateNumber: 'woot since unexpectedly',
  estimateNumber: 'joint meanwhile seagull',
  serviceAdvisor: 'pigsty',
  serviceAdvisorID: 'rebuke',
  createdBy: 'meh',
};

export const sampleWithFullData: IEstimate = {
  id: 29849,
  vehicleID: 'lest',
  vehicleBrand: 'more',
  vehicleModel: 'barring',
  licenseNo: 'misappropriate',
  vehicleOwnerID: 'frightened knowledgeable',
  vehicleOwnerName: 'with',
  vehicleOwnerContactNumber1: 'gee which father',
  vehicleOwnerContactNumber2: 'cardboard',
  isInsurance: false,
  insuranceName: 'clear',
  insuranceID: 'swat convalesce',
  opsUnitID: 'sans worthy quintessential',
  totalPrice: 13562.08,
  estimateID: 'blah own',
  preEstimateNumber: 'weary',
  estimateNumber: 'by uh-huh crank',
  numberOfPanels: 23308,
  serviceAdvisor: 'needily',
  serviceAdvisorID: 'judgementally tender',
  createdBy: 'westernize because',
  createdDate: dayjs('2025-04-25T05:46'),
  lastModifiedBy: 'mantua lyre',
  lastModifiedDate: dayjs('2025-04-25T14:51'),
};

export const sampleWithNewData: NewEstimate = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
