import dayjs from 'dayjs/esm';

export interface IInsuranceRegistry {
  id: number;
  insuranceName?: string | null;
  remark?: string | null;
  hotline?: string | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewInsuranceRegistry = Omit<IInsuranceRegistry, 'id'> & { id: null };
