import dayjs from 'dayjs/esm';

import { ISupplier, NewSupplier } from './supplier.model';

export const sampleWithRequiredData: ISupplier = {
  id: 22717,
};

export const sampleWithPartialData: ISupplier = {
  id: 27961,
  name: 'quaff',
  streetOffice: 'airline',
  cityOffice: 'curse dearly beside',
  addressFactory: 'whup midst cinch',
  streetFactory: 'within gadzooks up',
  cityFactory: 'among',
  email: 'Lee.Osinski2@hotmail.com',
  contactPersonPhone: 'whether likewise yuppify',
  registeredDate: dayjs('2025-06-03T12:08'),
  vatRegNumber: 'discourse er',
  tinNumber: 'after yuck phew',
  brNumberFilePath: 'destock loosely',
  agreementFilePath: 'sleepily yowza',
  isActive: false,
  lmu: 915,
  lmd: dayjs('2025-06-03T13:16'),
  accountId: 4908,
  accountCode: 'blah upliftingly',
  isNBTEnable: true,
  leadTime: 7589,
};

export const sampleWithFullData: ISupplier = {
  id: 3840,
  code: 'cheerfully near',
  shortCode: 'providence ick scholarship',
  name: 'lowball',
  addressOffice: 'fervently dependency',
  streetOffice: 'once likewise',
  cityOffice: 'enlightened',
  provinceOffice: 'than if neck',
  addressFactory: 'huzzah',
  streetFactory: 'than',
  cityFactory: 'towards plus',
  provinceFactory: 'stool',
  phone1: 'unto though jungle',
  phone2: 'solidly finally gastropod',
  fax: 'spectacles',
  email: 'Elias75@gmail.com',
  website: 'marketplace forenenst incidentally',
  contactPersonName: 'idealistic',
  contactPersonPhone: 'meanwhile gee',
  contactPersonMobile: 'instead',
  contactPersonEmail: 'dowse stunt clonk',
  registeredDate: dayjs('2025-06-04T05:58'),
  description: 'tentacle ah',
  brNumber: 'admired weakly youthfully',
  vatRegNumber: 'creak besides finer',
  tinNumber: 'supposing royal manipulate',
  brNumberFilePath: 'wearily humble',
  vatRegNumberFilePath: 'bah rarely',
  tinNumberFilePath: 'elementary',
  agreementFilePath: 'weighty so rationalize',
  roadMapFilePath: 'deceivingly consequently',
  isActive: true,
  lmu: 18251,
  lmd: dayjs('2025-06-03T22:11'),
  accountId: 16226,
  accountCode: 'drat excluding gosh',
  isVATEnable: true,
  isNBTEnable: true,
  leadTime: 29821,
  isRegistered: true,
  creditPeriod: 4312,
  creditLimit: 22539.48,
};

export const sampleWithNewData: NewSupplier = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
