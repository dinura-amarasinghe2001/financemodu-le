import dayjs from 'dayjs/esm';

export interface IAccounts {
  id: number;
  opsUnitID?: string | null;
  code?: string | null;
  date?: dayjs.Dayjs | null;
  name?: string | null;
  relationid?: number | null;
  type?: string | null;
  parent?: string | null;
  path?: string | null;
  child?: string | null;
  balance?: number | null;
  lmu?: string | null;
  lmd?: dayjs.Dayjs | null;
  accountLevel?: string | null;
  amount?: number | null;
  creditAmount?: number | null;
  debitAmount?: number | null;
}

export type NewAccounts = Omit<IAccounts, 'id'> & { id: null };
