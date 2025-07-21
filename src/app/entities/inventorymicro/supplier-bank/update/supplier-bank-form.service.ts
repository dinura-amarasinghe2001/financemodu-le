import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISupplierBank, NewSupplierBank } from '../supplier-bank.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISupplierBank for edit and NewSupplierBankFormGroupInput for create.
 */
type SupplierBankFormGroupInput = ISupplierBank | PartialWithRequiredKeyOf<NewSupplierBank>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISupplierBank | NewSupplierBank> = Omit<T, 'lmd'> & {
  lmd?: string | null;
};

type SupplierBankFormRawValue = FormValueOf<ISupplierBank>;

type NewSupplierBankFormRawValue = FormValueOf<NewSupplierBank>;

type SupplierBankFormDefaults = Pick<NewSupplierBank, 'id' | 'cash' | 'lmd'>;

type SupplierBankFormGroupContent = {
  id: FormControl<SupplierBankFormRawValue['id'] | NewSupplierBank['id']>;
  creditPeriod: FormControl<SupplierBankFormRawValue['creditPeriod']>;
  maximumDiscount: FormControl<SupplierBankFormRawValue['maximumDiscount']>;
  maximumCreditLimit: FormControl<SupplierBankFormRawValue['maximumCreditLimit']>;
  chequeDrawn: FormControl<SupplierBankFormRawValue['chequeDrawn']>;
  cash: FormControl<SupplierBankFormRawValue['cash']>;
  lmd: FormControl<SupplierBankFormRawValue['lmd']>;
  lmu: FormControl<SupplierBankFormRawValue['lmu']>;
};

export type SupplierBankFormGroup = FormGroup<SupplierBankFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SupplierBankFormService {
  createSupplierBankFormGroup(supplierBank: SupplierBankFormGroupInput = { id: null }): SupplierBankFormGroup {
    const supplierBankRawValue = this.convertSupplierBankToSupplierBankRawValue({
      ...this.getFormDefaults(),
      ...supplierBank,
    });
    return new FormGroup<SupplierBankFormGroupContent>({
      id: new FormControl(
        { value: supplierBankRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      creditPeriod: new FormControl(supplierBankRawValue.creditPeriod),
      maximumDiscount: new FormControl(supplierBankRawValue.maximumDiscount),
      maximumCreditLimit: new FormControl(supplierBankRawValue.maximumCreditLimit),
      chequeDrawn: new FormControl(supplierBankRawValue.chequeDrawn),
      cash: new FormControl(supplierBankRawValue.cash),
      lmd: new FormControl(supplierBankRawValue.lmd),
      lmu: new FormControl(supplierBankRawValue.lmu),
    });
  }

  getSupplierBank(form: SupplierBankFormGroup): ISupplierBank | NewSupplierBank {
    return this.convertSupplierBankRawValueToSupplierBank(form.getRawValue() as SupplierBankFormRawValue | NewSupplierBankFormRawValue);
  }

  resetForm(form: SupplierBankFormGroup, supplierBank: SupplierBankFormGroupInput): void {
    const supplierBankRawValue = this.convertSupplierBankToSupplierBankRawValue({ ...this.getFormDefaults(), ...supplierBank });
    form.reset(
      {
        ...supplierBankRawValue,
        id: { value: supplierBankRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SupplierBankFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      cash: false,
      lmd: currentTime,
    };
  }

  private convertSupplierBankRawValueToSupplierBank(
    rawSupplierBank: SupplierBankFormRawValue | NewSupplierBankFormRawValue,
  ): ISupplierBank | NewSupplierBank {
    return {
      ...rawSupplierBank,
      lmd: dayjs(rawSupplierBank.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertSupplierBankToSupplierBankRawValue(
    supplierBank: ISupplierBank | (Partial<NewSupplierBank> & SupplierBankFormDefaults),
  ): SupplierBankFormRawValue | PartialWithRequiredKeyOf<NewSupplierBankFormRawValue> {
    return {
      ...supplierBank,
      lmd: supplierBank.lmd ? supplierBank.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
