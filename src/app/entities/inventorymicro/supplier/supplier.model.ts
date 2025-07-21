import dayjs from 'dayjs/esm';

export interface ISupplier {
  id: number;
  code?: string | null;
  shortCode?: string | null;
  name?: string | null;
  addressOffice?: string | null;
  streetOffice?: string | null;
  cityOffice?: string | null;
  provinceOffice?: string | null;
  addressFactory?: string | null;
  streetFactory?: string | null;
  cityFactory?: string | null;
  provinceFactory?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  fax?: string | null;
  email?: string | null;
  website?: string | null;
  contactPersonName?: string | null;
  contactPersonPhone?: string | null;
  contactPersonMobile?: string | null;
  contactPersonEmail?: string | null;
  registeredDate?: dayjs.Dayjs | null;
  description?: string | null;
  brNumber?: string | null;
  vatRegNumber?: string | null;
  tinNumber?: string | null;
  brNumberFilePath?: string | null;
  vatRegNumberFilePath?: string | null;
  tinNumberFilePath?: string | null;
  agreementFilePath?: string | null;
  roadMapFilePath?: string | null;
  isActive?: boolean | null;
  lmu?: number | null;
  lmd?: dayjs.Dayjs | null;
  accountId?: number | null;
  accountCode?: string | null;
  isVATEnable?: boolean | null;
  isNBTEnable?: boolean | null;
  leadTime?: number | null;
  isRegistered?: boolean | null;
  creditPeriod?: number | null;
  creditLimit?: number | null;
}

export type NewSupplier = Omit<ISupplier, 'id'> & { id: null };
