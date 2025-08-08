import dayjs from 'dayjs/esm';

import { IAccounts, NewAccounts } from './accounts.model';

export const sampleWithRequiredData: IAccounts = {
  id: 24013,
};

export const sampleWithPartialData: IAccounts = {
  id: 13997,
  opsUnitID: 'tomb',
  code: 'skyscraper however',
  relationid: 3919,
  type: 'hmph',
  parent: 'wildly',
  lmd: dayjs('2025-07-23T04:27'),
  amount: 29468.94,
  creditAmount: 21209.12,
};

export const sampleWithFullData: IAccounts = {
  id: 9282,
  opsUnitID: 'accelerator',
  code: 'how when mockingly',
  date: dayjs('2025-07-23T03:28'),
  name: 'faraway abandoned finally',
  relationid: 57,
  type: 'yum during',
  parent: 'even pecan quietly',
  path: 'wildly politely',
  child: 'monocle hm',
  balance: 23593.69,
  lmu: 'noxious why phew',
  lmd: dayjs('2025-07-23T03:56'),
  accountLevel: 'syringe',
  amount: 23234.77,
  creditAmount: 24302.2,
  debitAmount: 26465.87,
};

export const sampleWithNewData: NewAccounts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
