import dayjs from 'dayjs/esm';

export interface IAccountType {
  id: number;
  opsUnitID?: string | null;
  type?: string | null;
  code?: string | null;
  lmu?: string | null;
  lmd?: dayjs.Dayjs | null;
  accountTypeValue?: number | null;
  canEdit?: boolean | null;
}

export type NewAccountType = Omit<IAccountType, 'id'> & { id: null };
