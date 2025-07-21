import { IVat, NewVat } from './vat.model';

export const sampleWithRequiredData: IVat = {
  id: 4349,
};

export const sampleWithPartialData: IVat = {
  id: 19650,
  vatRate: 17953.81,
};

export const sampleWithFullData: IVat = {
  id: 26406,
  vatRate: 31236,
  vatAmount: 18013.12,
  vatName: 'or impish',
};

export const sampleWithNewData: NewVat = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
