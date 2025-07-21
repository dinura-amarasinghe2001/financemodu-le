export interface ICategory {
  id: number;
  name?: string | null;
  fullPath?: string | null;
  parent?: ICategory | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
