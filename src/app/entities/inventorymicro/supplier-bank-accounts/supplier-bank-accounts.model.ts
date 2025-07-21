export interface ISupplierBankAccounts {
  id: number;
  bankId?: number | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankBranch?: string | null;
  bankBranchCode?: string | null;
  bankCode?: string | null;
  bankAccountName?: string | null;
}

export type NewSupplierBankAccounts = Omit<ISupplierBankAccounts, 'id'> & { id: null };
