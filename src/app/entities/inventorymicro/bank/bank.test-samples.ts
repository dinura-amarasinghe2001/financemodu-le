import { IBank, NewBank } from './bank.model';

export const sampleWithRequiredData: IBank = {
  id: 9928,
};

export const sampleWithPartialData: IBank = {
  id: 14291,
  iD: 18752,
  name: 'hot',
};

export const sampleWithFullData: IBank = {
  id: 26049,
  iD: 10399,
  name: 'colonialism beneath',
};

export const sampleWithNewData: NewBank = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
