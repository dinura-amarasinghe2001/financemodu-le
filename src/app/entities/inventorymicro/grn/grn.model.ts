import dayjs from 'dayjs/esm';

export interface IGRN {
  id: number;
  grnCode?: string | null;
  grnDate?: dayjs.Dayjs | null;
  poNum?: string | null;
  supplierId?: number | null;
  supplierName?: string | null;
  supplierAddress?: string | null;
  invoiceId?: number | null;
  invoiceCode?: string | null;
  subTotal?: number | null;
  lmu?: number | null;
  lmd?: dayjs.Dayjs | null;
  amountOwing?: number | null;
  isActive?: boolean | null;
  inspected?: boolean | null;
  orderId?: number | null;
  supplierInvoiceCode?: string | null;
  isAccountSectionChecked?: boolean | null;
  total?: number | null;
  isInventoryUpdated?: boolean | null;
  comments?: string | null;
  supplierInvoiceDate?: dayjs.Dayjs | null;
  supplierDiscount?: number | null;
}

export type NewGRN = Omit<IGRN, 'id'> & { id: null };
