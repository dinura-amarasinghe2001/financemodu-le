export interface IBankBranch {
  id: number;
  iD?: number | null;
  name?: string | null;
  bankID?: number | null;
}

export type NewBankBranch = Omit<IBankBranch, 'id'> & { id: null };
