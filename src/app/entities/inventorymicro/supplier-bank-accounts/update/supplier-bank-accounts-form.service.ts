import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ISupplierBankAccounts, NewSupplierBankAccounts } from '../supplier-bank-accounts.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISupplierBankAccounts for edit and NewSupplierBankAccountsFormGroupInput for create.
 */
type SupplierBankAccountsFormGroupInput = ISupplierBankAccounts | PartialWithRequiredKeyOf<NewSupplierBankAccounts>;

type SupplierBankAccountsFormDefaults = Pick<NewSupplierBankAccounts, 'id'>;

type SupplierBankAccountsFormGroupContent = {
  id: FormControl<ISupplierBankAccounts['id'] | NewSupplierBankAccounts['id']>;
  bankId: FormControl<ISupplierBankAccounts['bankId']>;
  bankName: FormControl<ISupplierBankAccounts['bankName']>;
  bankAccountNumber: FormControl<ISupplierBankAccounts['bankAccountNumber']>;
  bankBranch: FormControl<ISupplierBankAccounts['bankBranch']>;
  bankBranchCode: FormControl<ISupplierBankAccounts['bankBranchCode']>;
  bankCode: FormControl<ISupplierBankAccounts['bankCode']>;
  bankAccountName: FormControl<ISupplierBankAccounts['bankAccountName']>;
};

export type SupplierBankAccountsFormGroup = FormGroup<SupplierBankAccountsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SupplierBankAccountsFormService {
  createSupplierBankAccountsFormGroup(
    supplierBankAccounts: SupplierBankAccountsFormGroupInput = { id: null },
  ): SupplierBankAccountsFormGroup {
    const supplierBankAccountsRawValue = {
      ...this.getFormDefaults(),
      ...supplierBankAccounts,
    };
    return new FormGroup<SupplierBankAccountsFormGroupContent>({
      id: new FormControl(
        { value: supplierBankAccountsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      bankId: new FormControl(supplierBankAccountsRawValue.bankId),
      bankName: new FormControl(supplierBankAccountsRawValue.bankName),
      bankAccountNumber: new FormControl(supplierBankAccountsRawValue.bankAccountNumber),
      bankBranch: new FormControl(supplierBankAccountsRawValue.bankBranch),
      bankBranchCode: new FormControl(supplierBankAccountsRawValue.bankBranchCode),
      bankCode: new FormControl(supplierBankAccountsRawValue.bankCode),
      bankAccountName: new FormControl(supplierBankAccountsRawValue.bankAccountName),
    });
  }

  getSupplierBankAccounts(form: SupplierBankAccountsFormGroup): ISupplierBankAccounts | NewSupplierBankAccounts {
    return form.getRawValue() as ISupplierBankAccounts | NewSupplierBankAccounts;
  }

  resetForm(form: SupplierBankAccountsFormGroup, supplierBankAccounts: SupplierBankAccountsFormGroupInput): void {
    const supplierBankAccountsRawValue = { ...this.getFormDefaults(), ...supplierBankAccounts };
    form.reset(
      {
        ...supplierBankAccountsRawValue,
        id: { value: supplierBankAccountsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SupplierBankAccountsFormDefaults {
    return {
      id: null,
    };
  }
}
