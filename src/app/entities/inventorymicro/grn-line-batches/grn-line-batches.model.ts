import dayjs from 'dayjs/esm';

export interface IGRNLineBatches {
  id: number;
  lineId?: number | null;
  batchLineId?: number | null;
  itemId?: number | null;
  code?: string | null;
  txDate?: dayjs.Dayjs | null;
  manufactureDate?: dayjs.Dayjs | null;
  expiredDate?: dayjs.Dayjs | null;
  qty?: number | null;
  cost?: number | null;
  price?: number | null;
  costWithoutVat?: number | null;
  priceWithoutVat?: number | null;
  hasVat?: boolean | null;
  supplierDiscount?: number | null;
  notes?: string | null;
  lmu?: number | null;
  lmd?: dayjs.Dayjs | null;
  batchId?: number | null;
  qtyIn?: number | null;
  qtyOut?: number | null;
  batchLineTotal?: number | null;
  inspected?: boolean | null;
  passQty?: number | null;
  currentReceivedQty?: number | null;
  totalPassedQty?: number | null;
  isInventoryUpdate?: boolean | null;
  inventoryQty?: number | null;
  totalInventoryQty?: number | null;
  returnPrice?: number | null;
}

export type NewGRNLineBatches = Omit<IGRNLineBatches, 'id'> & { id: null };
