import dayjs from 'dayjs/esm';

import { IAppointment, NewAppointment } from './appointment.model';

export const sampleWithRequiredData: IAppointment = {
  id: 13399,
};

export const sampleWithPartialData: IAppointment = {
  id: 23529,
  vehicleID: 'deflect',
  vehicleModel: 'trash gee',
  clientName: 'showy',
  clientContactNumber2: 'whenever diver',
  clientAddress: 'why what',
  clientCity: 'mostly needily supposing',
  opsUnitID: 'up whether yellowish',
  isPaint: false,
  isService: true,
  createdBy: 'undergo unaccountably',
  lastModifiedDate: dayjs('2025-04-07T06:02'),
};

export const sampleWithFullData: IAppointment = {
  id: 5963,
  appointmentDateTime: dayjs('2025-04-07T02:40'),
  licenseNo: 'how near out',
  vehicleID: 'seemingly',
  vehicleBrand: 'cripple pressure average',
  vehicleModel: 'baptise purse',
  clientID: 'foretell',
  clientName: 'ridge forenenst',
  clientContactNumber1: 'psst',
  clientContactNumber2: 'interviewer wicked',
  clientAddress: 'desecrate bah aching',
  clientCity: 'irritably incomplete deceivingly',
  remarks: 'graceful rigidly weighty',
  appointmentType: 'MORNING',
  opsUnitID: 'worst',
  isPaint: false,
  isTinker: true,
  isSpare: false,
  isService: false,
  createdBy: 'ack availability gosh',
  createdDate: dayjs('2025-04-07T03:29'),
  lastModifiedBy: 'failing',
  lastModifiedDate: dayjs('2025-04-07T16:15'),
};

export const sampleWithNewData: NewAppointment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
