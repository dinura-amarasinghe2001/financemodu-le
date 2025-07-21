import dayjs from 'dayjs/esm';

export interface IGRNLines {
  id: number;
  grnId?: number | null;
  lineId?: number | null;
  itemId?: number | null;
  itemCode?: string | null;
  itemName?: string | null;
  description?: string | null;
  unitOfMeasurement?: string | null;
  quantity?: number | null;
  receivedQuantity?: number | null;
  price?: number | null;
  totalAmount?: number | null;
  lineTotal?: number | null;
  lmu?: number | null;
  lmd?: dayjs.Dayjs | null;
  inspected?: boolean | null;
  passQty?: number | null;
  currentReceivedQty?: number | null;
  totalPassedQty?: number | null;
  isInventoryUpdate?: boolean | null;
  inventoryQty?: number | null;
  totalInventoryQty?: number | null;
}

export type NewGRNLines = Omit<IGRNLines, 'id'> & { id: null };
