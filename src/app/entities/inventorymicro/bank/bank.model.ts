export interface IBank {
  id: number;
  iD?: number | null;
  name?: string | null;
}

export type NewBank = Omit<IBank, 'id'> & { id: null };
