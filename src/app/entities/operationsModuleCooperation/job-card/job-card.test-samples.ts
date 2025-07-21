import dayjs from 'dayjs/esm';

import { IJobCard, NewJobCard } from './job-card.model';

export const sampleWithRequiredData: IJobCard = {
  id: 31691,
};

export const sampleWithPartialData: IJobCard = {
  id: 23654,
  vehicleModel: 'wafer refer bah',
  vehicleOwnerID: 'truly whose',
  vehicleOwnerContactNumber1: 'upright',
  vehicleOwnerContactNumber2: 'mmm utter',
  estimateID: 'coop ew',
  insuranceCompany: 'tinderbox',
  serviceAdvisorID: 'giant diligently',
  tinkeringStartDateTime: dayjs('2025-04-25T16:46'),
  paintEndDateTime: dayjs('2025-04-25T06:58'),
  qcStartDateTime: dayjs('2025-04-26T03:06'),
  sparePartStartDateTime: dayjs('2025-04-25T06:14'),
  createdBy: 'than judgementally swing',
  lastModifiedDate: dayjs('2025-04-25T11:27'),
};

export const sampleWithFullData: IJobCard = {
  id: 7343,
  vehicleID: 'concerned enthusiastically',
  vehicleBrand: 'aha provided ah',
  vehicleModel: 'yippee whoever',
  vehicleLicenseNumber: 'snack',
  vehicleOwnerID: 'rigidly',
  vehicleOwnerName: 'whenever psst',
  vehicleOwnerContactNumber1: 'a litter to',
  vehicleOwnerContactNumber2: 'opposite',
  estimateID: 'tinted sideboard',
  insuranceCompany: 'amnesty',
  serviceAdvisor: 'other',
  serviceAdvisorID: 'veg concerning pliers',
  numberOfPanels: 31822,
  fuelLevel: 'wordy duh',
  meterReading: 'too hm',
  startDate: dayjs('2025-04-25T13:35'),
  jobCardNumber: 'offensively',
  jobCompleteDate: dayjs('2025-04-25T09:42'),
  boothDate: dayjs('2025-04-26T00:11'),
  opsUnitID: 'while inasmuch',
  tinkeringStartDateTime: dayjs('2025-04-25T10:55'),
  tinkeringEndDateTime: dayjs('2025-04-25T08:42'),
  paintStartDateTime: dayjs('2025-04-25T23:52'),
  paintEndDateTime: dayjs('2025-04-26T04:08'),
  qcStartDateTime: dayjs('2025-04-25T15:59'),
  qcEndDateTime: dayjs('2025-04-25T19:28'),
  sparePartStartDateTime: dayjs('2025-04-25T07:55'),
  sparePartEndDateTime: dayjs('2025-04-26T03:26'),
  createdBy: 'boohoo',
  createdDate: dayjs('2025-04-25T07:28'),
  lastModifiedBy: 'on expostulate',
  lastModifiedDate: dayjs('2025-04-26T02:54'),
};

export const sampleWithNewData: NewJobCard = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
