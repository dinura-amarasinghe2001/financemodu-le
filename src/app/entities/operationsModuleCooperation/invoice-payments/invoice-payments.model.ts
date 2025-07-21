import dayjs from 'dayjs/esm';
import { IInvoice } from '../invoice/invoice.model';
// import { IInvoice } from 'app/entities/operationsModule/invoice/invoice.model';

export interface IInvoicePayments {
  id: number;
  paymentType?: string | null;
  amount?: number | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  invoice?: IInvoice | null;
}

export type NewInvoicePayments = Omit<IInvoicePayments, 'id'> & { id: null };
