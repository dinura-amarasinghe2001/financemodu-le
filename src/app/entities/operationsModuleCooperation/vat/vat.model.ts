export interface IVat {
  id: number;
  vatRate?: number | null;
  vatAmount?: number | null;
  vatName?: string | null;
}

export type NewVat = Omit<IVat, 'id'> & { id: null };
