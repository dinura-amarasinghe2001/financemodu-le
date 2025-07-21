import dayjs from 'dayjs/esm';

export interface IBrand {
  id: number;
  brandName?: string | null;
  description?: string | null;
  opsUnitID?: string | null;
  emblem?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewBrand = Omit<IBrand, 'id'> & { id: null };
