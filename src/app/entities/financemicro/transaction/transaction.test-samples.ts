import dayjs from 'dayjs/esm';

import { ITransaction, NewTransaction } from './transaction.model';

export const sampleWithRequiredData: ITransaction = {
  id: 3793,
};

export const sampleWithPartialData: ITransaction = {
  id: 25264,
  accountId: 26098,
  debit: 1023.05,
  credit: 31506.07,
  source: 'meager versus',
};

export const sampleWithFullData: ITransaction = {
  id: 20285,
  opsUnitID: 'cloudy',
  accountId: 24229,
  accountCode: 'kissingly',
  debit: 6155.55,
  credit: 18476.76,
  date: dayjs('2025-07-23T08:03'),
  refDoc: 'kindheartedly hourly yawn',
  relid: 1365,
  subId: 6862,
  source: 'via',
  lmu: 'swing instead',
  lmd: dayjs('2025-07-22T20:40'),
};

export const sampleWithNewData: NewTransaction = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
