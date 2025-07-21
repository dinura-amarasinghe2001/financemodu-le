import dayjs from 'dayjs/esm';
import { IInvoice } from '../invoice/invoice.model';

export interface IInvoiceItem {
  id: number;
  invoiceDate?: dayjs.Dayjs | null;
  descriptions?: string | null;
  amount?: number | null;
  types?: string | null;
  invoice?: IInvoice | null;
}

export type NewInvoiceItem = Omit<IInvoiceItem, 'id'> & { id: null };
