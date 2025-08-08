import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAccounts, NewAccounts } from '../accounts.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAccounts for edit and NewAccountsFormGroupInput for create.
 */
type AccountsFormGroupInput = IAccounts | PartialWithRequiredKeyOf<NewAccounts>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAccounts | NewAccounts> = Omit<T, 'date' | 'lmd'> & {
  date?: string | null;
  lmd?: string | null;
};

type AccountsFormRawValue = FormValueOf<IAccounts>;

type NewAccountsFormRawValue = FormValueOf<NewAccounts>;

type AccountsFormDefaults = Pick<NewAccounts, 'id' | 'date' | 'lmd'>;

type AccountsFormGroupContent = {
  id: FormControl<AccountsFormRawValue['id'] | NewAccounts['id']>;
  opsUnitID: FormControl<AccountsFormRawValue['opsUnitID']>;
  code: FormControl<AccountsFormRawValue['code']>;
  date: FormControl<AccountsFormRawValue['date']>;
  name: FormControl<AccountsFormRawValue['name']>;
  relationid: FormControl<AccountsFormRawValue['relationid']>;
  type: FormControl<AccountsFormRawValue['type']>;
  parent: FormControl<AccountsFormRawValue['parent']>;
  path: FormControl<AccountsFormRawValue['path']>;
  child: FormControl<AccountsFormRawValue['child']>;
  balance: FormControl<AccountsFormRawValue['balance']>;
  lmu: FormControl<AccountsFormRawValue['lmu']>;
  lmd: FormControl<AccountsFormRawValue['lmd']>;
  accountLevel: FormControl<AccountsFormRawValue['accountLevel']>;
  amount: FormControl<AccountsFormRawValue['amount']>;
  creditAmount: FormControl<AccountsFormRawValue['creditAmount']>;
  debitAmount: FormControl<AccountsFormRawValue['debitAmount']>;
};

export type AccountsFormGroup = FormGroup<AccountsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AccountsFormService {
  createAccountsFormGroup(accounts: AccountsFormGroupInput = { id: null }): AccountsFormGroup {
    const accountsRawValue = this.convertAccountsToAccountsRawValue({
      ...this.getFormDefaults(),
      ...accounts,
    });
    return new FormGroup<AccountsFormGroupContent>({
      id: new FormControl(
        { value: accountsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      opsUnitID: new FormControl(accountsRawValue.opsUnitID),
      code: new FormControl(accountsRawValue.code),
      date: new FormControl(accountsRawValue.date),
      name: new FormControl(accountsRawValue.name),
      relationid: new FormControl(accountsRawValue.relationid),
      type: new FormControl(accountsRawValue.type),
      parent: new FormControl(accountsRawValue.parent),
      path: new FormControl(accountsRawValue.path),
      child: new FormControl(accountsRawValue.child),
      balance: new FormControl(accountsRawValue.balance),
      lmu: new FormControl(accountsRawValue.lmu),
      lmd: new FormControl(accountsRawValue.lmd),
      accountLevel: new FormControl(accountsRawValue.accountLevel),
      amount: new FormControl(accountsRawValue.amount),
      creditAmount: new FormControl(accountsRawValue.creditAmount),
      debitAmount: new FormControl(accountsRawValue.debitAmount),
    });
  }

  getAccounts(form: AccountsFormGroup): IAccounts | NewAccounts {
    return this.convertAccountsRawValueToAccounts(form.getRawValue() as AccountsFormRawValue | NewAccountsFormRawValue);
  }

  resetForm(form: AccountsFormGroup, accounts: AccountsFormGroupInput): void {
    const accountsRawValue = this.convertAccountsToAccountsRawValue({ ...this.getFormDefaults(), ...accounts });
    form.reset(
      {
        ...accountsRawValue,
        id: { value: accountsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AccountsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      lmd: currentTime,
    };
  }

  private convertAccountsRawValueToAccounts(rawAccounts: AccountsFormRawValue | NewAccountsFormRawValue): IAccounts | NewAccounts {
    return {
      ...rawAccounts,
      date: dayjs(rawAccounts.date, DATE_TIME_FORMAT),
      lmd: dayjs(rawAccounts.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertAccountsToAccountsRawValue(
    accounts: IAccounts | (Partial<NewAccounts> & AccountsFormDefaults),
  ): AccountsFormRawValue | PartialWithRequiredKeyOf<NewAccountsFormRawValue> {
    return {
      ...accounts,
      date: accounts.date ? accounts.date.format(DATE_TIME_FORMAT) : undefined,
      lmd: accounts.lmd ? accounts.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
