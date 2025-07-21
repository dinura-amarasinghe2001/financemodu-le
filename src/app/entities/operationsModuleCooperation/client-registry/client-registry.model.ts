import dayjs from 'dayjs/esm';

export interface IClientRegistry {
  id: number;
  name?: string | null;
  lastVehicleID?: string | null;
  lastReceiptID?: string | null;
  address?: string | null;
  city?: string | null;
  contactNumber1?: string | null;
  contactNumber2?: string | null;
  email?: string | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewClientRegistry = Omit<IClientRegistry, 'id'> & { id: null };
