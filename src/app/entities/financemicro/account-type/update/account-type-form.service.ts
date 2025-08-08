import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAccountType, NewAccountType } from '../account-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAccountType for edit and NewAccountTypeFormGroupInput for create.
 */
type AccountTypeFormGroupInput = IAccountType | PartialWithRequiredKeyOf<NewAccountType>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAccountType | NewAccountType> = Omit<T, 'lmd'> & {
  lmd?: string | null;
};

type AccountTypeFormRawValue = FormValueOf<IAccountType>;

type NewAccountTypeFormRawValue = FormValueOf<NewAccountType>;

type AccountTypeFormDefaults = Pick<NewAccountType, 'id' | 'lmd' | 'canEdit'>;

type AccountTypeFormGroupContent = {
  id: FormControl<AccountTypeFormRawValue['id'] | NewAccountType['id']>;
  opsUnitID: FormControl<AccountTypeFormRawValue['opsUnitID']>;
  type: FormControl<AccountTypeFormRawValue['type']>;
  code: FormControl<AccountTypeFormRawValue['code']>;
  lmu: FormControl<AccountTypeFormRawValue['lmu']>;
  lmd: FormControl<AccountTypeFormRawValue['lmd']>;
  accountTypeValue: FormControl<AccountTypeFormRawValue['accountTypeValue']>;
  canEdit: FormControl<AccountTypeFormRawValue['canEdit']>;
};

export type AccountTypeFormGroup = FormGroup<AccountTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AccountTypeFormService {
  createAccountTypeFormGroup(accountType: AccountTypeFormGroupInput = { id: null }): AccountTypeFormGroup {
    const accountTypeRawValue = this.convertAccountTypeToAccountTypeRawValue({
      ...this.getFormDefaults(),
      ...accountType,
    });
    return new FormGroup<AccountTypeFormGroupContent>({
      id: new FormControl(
        { value: accountTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      opsUnitID: new FormControl(accountTypeRawValue.opsUnitID),
      type: new FormControl(accountTypeRawValue.type),
      code: new FormControl(accountTypeRawValue.code),
      lmu: new FormControl(accountTypeRawValue.lmu),
      lmd: new FormControl(accountTypeRawValue.lmd),
      accountTypeValue: new FormControl(accountTypeRawValue.accountTypeValue),
      canEdit: new FormControl(accountTypeRawValue.canEdit),
    });
  }

  getAccountType(form: AccountTypeFormGroup): IAccountType | NewAccountType {
    return this.convertAccountTypeRawValueToAccountType(form.getRawValue() as AccountTypeFormRawValue | NewAccountTypeFormRawValue);
  }

  resetForm(form: AccountTypeFormGroup, accountType: AccountTypeFormGroupInput): void {
    const accountTypeRawValue = this.convertAccountTypeToAccountTypeRawValue({ ...this.getFormDefaults(), ...accountType });
    form.reset(
      {
        ...accountTypeRawValue,
        id: { value: accountTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AccountTypeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lmd: currentTime,
      canEdit: false,
    };
  }

  private convertAccountTypeRawValueToAccountType(
    rawAccountType: AccountTypeFormRawValue | NewAccountTypeFormRawValue,
  ): IAccountType | NewAccountType {
    return {
      ...rawAccountType,
      lmd: dayjs(rawAccountType.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertAccountTypeToAccountTypeRawValue(
    accountType: IAccountType | (Partial<NewAccountType> & AccountTypeFormDefaults),
  ): AccountTypeFormRawValue | PartialWithRequiredKeyOf<NewAccountTypeFormRawValue> {
    return {
      ...accountType,
      lmd: accountType.lmd ? accountType.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
