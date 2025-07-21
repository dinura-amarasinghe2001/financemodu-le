import { IBankBranch, NewBankBranch } from './bank-branch.model';

export const sampleWithRequiredData: IBankBranch = {
  id: 20977,
};

export const sampleWithPartialData: IBankBranch = {
  id: 31094,
  name: 'beret pants',
};

export const sampleWithFullData: IBankBranch = {
  id: 20021,
  iD: 2630,
  name: 'precious wrongly',
  bankID: 16567,
};

export const sampleWithNewData: NewBankBranch = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
