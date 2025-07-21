import { InvoiceStatus } from "app/entities/enumerations/invoice-status.model";
import dayjs from "dayjs/esm";

export interface IInvoice {
  id: number;
  invoiceNumber?: string | null;
  insuranceName?: string | null;
  vehicleID?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  vehicleLicenseNumber?: string | null;
  vehicleOwnerID?: string | null;
  vehicleOwnerName?: string | null;
  vehicleOwnerContactNumber1?: string | null;
  vehicleOwnerContactNumber2?: string | null;
  jobID?: string | null;
  totalNetAmount?: number | null;
  discountRate?: number | null;
  discountAmount?: number | null;
  totalAmount?: number | null;
  netTotalAmount?: number | null;
  vatAmount?: number | null;
  customerVATNumber?: string | null;
  invoiceDate?: dayjs.Dayjs | null;
  invoiceStatus?: keyof typeof InvoiceStatus | null;
}

export type NewInvoice = Omit<IInvoice, "id"> & { id: null };
