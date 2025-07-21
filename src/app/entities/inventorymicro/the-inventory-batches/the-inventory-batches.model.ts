import dayjs from 'dayjs/esm';

export interface ITheInventoryBatches {
  id: number;
  itemId?: number | null;
  grnId?: number | null;
  code?: string | null;
  txDate?: dayjs.Dayjs | null;
  cost?: number | null;
  price?: number | null;
  costWithoutVat?: number | null;
  priceWithoutVat?: number | null;
  notes?: string | null;
  lmu?: number | null;
  lmd?: dayjs.Dayjs | null;
  lineId?: number | null;
  manufactureDate?: dayjs.Dayjs | null;
  expireDate?: dayjs.Dayjs | null;
  quantity?: number | null;
  addedDate?: dayjs.Dayjs | null;
  costTotal?: number | null;
  returnPrice?: number | null;
}

export type NewTheInventoryBatches = Omit<ITheInventoryBatches, 'id'> & { id: null };
