import dayjs from 'dayjs/esm';

export interface ISupplierBank {
  id: number;
  creditPeriod?: number | null;
  maximumDiscount?: number | null;
  maximumCreditLimit?: number | null;
  chequeDrawn?: string | null;
  cash?: boolean | null;
  lmd?: dayjs.Dayjs | null;
  lmu?: string | null;
}

export type NewSupplierBank = Omit<ISupplierBank, 'id'> & { id: null };
