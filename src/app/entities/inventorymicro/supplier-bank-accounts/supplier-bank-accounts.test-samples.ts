import { ISupplierBankAccounts, NewSupplierBankAccounts } from './supplier-bank-accounts.model';

export const sampleWithRequiredData: ISupplierBankAccounts = {
  id: 6366,
};

export const sampleWithPartialData: ISupplierBankAccounts = {
  id: 31013,
  bankName: 'unless',
  bankBranch: 'cauliflower generously',
  bankCode: 'why procrastinate frozen',
};

export const sampleWithFullData: ISupplierBankAccounts = {
  id: 19475,
  bankId: 11777,
  bankName: 'sun',
  bankAccountNumber: 'optimal',
  bankBranch: 'so',
  bankBranchCode: 'revitalise like',
  bankCode: 'sudden till awful',
  bankAccountName: 'how forenenst',
};

export const sampleWithNewData: NewSupplierBankAccounts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
