import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISupplier, NewSupplier } from '../supplier.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISupplier for edit and NewSupplierFormGroupInput for create.
 */
type SupplierFormGroupInput = ISupplier | PartialWithRequiredKeyOf<NewSupplier>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISupplier | NewSupplier> = Omit<T, 'registeredDate' | 'lmd'> & {
  registeredDate?: string | null;
  lmd?: string | null;
};

type SupplierFormRawValue = FormValueOf<ISupplier>;

type NewSupplierFormRawValue = FormValueOf<NewSupplier>;

type SupplierFormDefaults = Pick<
  NewSupplier,
  'id' | 'registeredDate' | 'isActive' | 'lmd' | 'isVATEnable' | 'isNBTEnable' | 'isRegistered'
>;

type SupplierFormGroupContent = {
  id: FormControl<SupplierFormRawValue['id'] | NewSupplier['id']>;
  code: FormControl<SupplierFormRawValue['code']>;
  shortCode: FormControl<SupplierFormRawValue['shortCode']>;
  name: FormControl<SupplierFormRawValue['name']>;
  addressOffice: FormControl<SupplierFormRawValue['addressOffice']>;
  streetOffice: FormControl<SupplierFormRawValue['streetOffice']>;
  cityOffice: FormControl<SupplierFormRawValue['cityOffice']>;
  provinceOffice: FormControl<SupplierFormRawValue['provinceOffice']>;
  addressFactory: FormControl<SupplierFormRawValue['addressFactory']>;
  streetFactory: FormControl<SupplierFormRawValue['streetFactory']>;
  cityFactory: FormControl<SupplierFormRawValue['cityFactory']>;
  provinceFactory: FormControl<SupplierFormRawValue['provinceFactory']>;
  phone1: FormControl<SupplierFormRawValue['phone1']>;
  phone2: FormControl<SupplierFormRawValue['phone2']>;
  fax: FormControl<SupplierFormRawValue['fax']>;
  email: FormControl<SupplierFormRawValue['email']>;
  website: FormControl<SupplierFormRawValue['website']>;
  contactPersonName: FormControl<SupplierFormRawValue['contactPersonName']>;
  contactPersonPhone: FormControl<SupplierFormRawValue['contactPersonPhone']>;
  contactPersonMobile: FormControl<SupplierFormRawValue['contactPersonMobile']>;
  contactPersonEmail: FormControl<SupplierFormRawValue['contactPersonEmail']>;
  registeredDate: FormControl<SupplierFormRawValue['registeredDate']>;
  description: FormControl<SupplierFormRawValue['description']>;
  brNumber: FormControl<SupplierFormRawValue['brNumber']>;
  vatRegNumber: FormControl<SupplierFormRawValue['vatRegNumber']>;
  tinNumber: FormControl<SupplierFormRawValue['tinNumber']>;
  brNumberFilePath: FormControl<SupplierFormRawValue['brNumberFilePath']>;
  vatRegNumberFilePath: FormControl<SupplierFormRawValue['vatRegNumberFilePath']>;
  tinNumberFilePath: FormControl<SupplierFormRawValue['tinNumberFilePath']>;
  agreementFilePath: FormControl<SupplierFormRawValue['agreementFilePath']>;
  roadMapFilePath: FormControl<SupplierFormRawValue['roadMapFilePath']>;
  isActive: FormControl<SupplierFormRawValue['isActive']>;
  lmu: FormControl<SupplierFormRawValue['lmu']>;
  lmd: FormControl<SupplierFormRawValue['lmd']>;
  accountId: FormControl<SupplierFormRawValue['accountId']>;
  accountCode: FormControl<SupplierFormRawValue['accountCode']>;
  isVATEnable: FormControl<SupplierFormRawValue['isVATEnable']>;
  isNBTEnable: FormControl<SupplierFormRawValue['isNBTEnable']>;
  leadTime: FormControl<SupplierFormRawValue['leadTime']>;
  isRegistered: FormControl<SupplierFormRawValue['isRegistered']>;
  creditPeriod: FormControl<SupplierFormRawValue['creditPeriod']>;
  creditLimit: FormControl<SupplierFormRawValue['creditLimit']>;
};

export type SupplierFormGroup = FormGroup<SupplierFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SupplierFormService {
  createSupplierFormGroup(supplier: SupplierFormGroupInput = { id: null }): SupplierFormGroup {
    const supplierRawValue = this.convertSupplierToSupplierRawValue({
      ...this.getFormDefaults(),
      ...supplier,
    });
    return new FormGroup<SupplierFormGroupContent>({
      id: new FormControl(
        { value: supplierRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(supplierRawValue.code),
      shortCode: new FormControl(supplierRawValue.shortCode),
      name: new FormControl(supplierRawValue.name),
      addressOffice: new FormControl(supplierRawValue.addressOffice),
      streetOffice: new FormControl(supplierRawValue.streetOffice),
      cityOffice: new FormControl(supplierRawValue.cityOffice),
      provinceOffice: new FormControl(supplierRawValue.provinceOffice),
      addressFactory: new FormControl(supplierRawValue.addressFactory),
      streetFactory: new FormControl(supplierRawValue.streetFactory),
      cityFactory: new FormControl(supplierRawValue.cityFactory),
      provinceFactory: new FormControl(supplierRawValue.provinceFactory),
      phone1: new FormControl(supplierRawValue.phone1),
      phone2: new FormControl(supplierRawValue.phone2),
      fax: new FormControl(supplierRawValue.fax),
      email: new FormControl(supplierRawValue.email),
      website: new FormControl(supplierRawValue.website),
      contactPersonName: new FormControl(supplierRawValue.contactPersonName),
      contactPersonPhone: new FormControl(supplierRawValue.contactPersonPhone),
      contactPersonMobile: new FormControl(supplierRawValue.contactPersonMobile),
      contactPersonEmail: new FormControl(supplierRawValue.contactPersonEmail),
      registeredDate: new FormControl(supplierRawValue.registeredDate),
      description: new FormControl(supplierRawValue.description),
      brNumber: new FormControl(supplierRawValue.brNumber),
      vatRegNumber: new FormControl(supplierRawValue.vatRegNumber),
      tinNumber: new FormControl(supplierRawValue.tinNumber),
      brNumberFilePath: new FormControl(supplierRawValue.brNumberFilePath),
      vatRegNumberFilePath: new FormControl(supplierRawValue.vatRegNumberFilePath),
      tinNumberFilePath: new FormControl(supplierRawValue.tinNumberFilePath),
      agreementFilePath: new FormControl(supplierRawValue.agreementFilePath),
      roadMapFilePath: new FormControl(supplierRawValue.roadMapFilePath),
      isActive: new FormControl(supplierRawValue.isActive),
      lmu: new FormControl(supplierRawValue.lmu),
      lmd: new FormControl(supplierRawValue.lmd),
      accountId: new FormControl(supplierRawValue.accountId),
      accountCode: new FormControl(supplierRawValue.accountCode),
      isVATEnable: new FormControl(supplierRawValue.isVATEnable),
      isNBTEnable: new FormControl(supplierRawValue.isNBTEnable),
      leadTime: new FormControl(supplierRawValue.leadTime),
      isRegistered: new FormControl(supplierRawValue.isRegistered),
      creditPeriod: new FormControl(supplierRawValue.creditPeriod),
      creditLimit: new FormControl(supplierRawValue.creditLimit),
    });
  }

  getSupplier(form: SupplierFormGroup): ISupplier | NewSupplier {
    return this.convertSupplierRawValueToSupplier(form.getRawValue() as SupplierFormRawValue | NewSupplierFormRawValue);
  }

  resetForm(form: SupplierFormGroup, supplier: SupplierFormGroupInput): void {
    const supplierRawValue = this.convertSupplierToSupplierRawValue({ ...this.getFormDefaults(), ...supplier });
    form.reset(
      {
        ...supplierRawValue,
        id: { value: supplierRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SupplierFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      registeredDate: currentTime,
      isActive: false,
      lmd: currentTime,
      isVATEnable: false,
      isNBTEnable: false,
      isRegistered: false,
    };
  }

  private convertSupplierRawValueToSupplier(rawSupplier: SupplierFormRawValue | NewSupplierFormRawValue): ISupplier | NewSupplier {
    return {
      ...rawSupplier,
      registeredDate: dayjs(rawSupplier.registeredDate, DATE_TIME_FORMAT),
      lmd: dayjs(rawSupplier.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertSupplierToSupplierRawValue(
    supplier: ISupplier | (Partial<NewSupplier> & SupplierFormDefaults),
  ): SupplierFormRawValue | PartialWithRequiredKeyOf<NewSupplierFormRawValue> {
    return {
      ...supplier,
      registeredDate: supplier.registeredDate ? supplier.registeredDate.format(DATE_TIME_FORMAT) : undefined,
      lmd: supplier.lmd ? supplier.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
