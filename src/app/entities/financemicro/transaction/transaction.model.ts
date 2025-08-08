import dayjs from 'dayjs/esm';

export interface ITransaction {
  id: number;
  opsUnitID?: string | null;
  accountId?: number | null;
  accountCode?: string | null;
  debit?: number | null;
  credit?: number | null;
  date?: dayjs.Dayjs | null;
  refDoc?: string | null;
  relid?: number | null;
  subId?: number | null;
  source?: string | null;
  lmu?: string | null;
  lmd?: dayjs.Dayjs | null;
}

export type NewTransaction = Omit<ITransaction, 'id'> & { id: null };
