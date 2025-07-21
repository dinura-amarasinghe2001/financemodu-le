import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IBankBranch, NewBankBranch } from '../bank-branch.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBankBranch for edit and NewBankBranchFormGroupInput for create.
 */
type BankBranchFormGroupInput = IBankBranch | PartialWithRequiredKeyOf<NewBankBranch>;

type BankBranchFormDefaults = Pick<NewBankBranch, 'id'>;

type BankBranchFormGroupContent = {
  id: FormControl<IBankBranch['id'] | NewBankBranch['id']>;
  iD: FormControl<IBankBranch['iD']>;
  name: FormControl<IBankBranch['name']>;
  bankID: FormControl<IBankBranch['bankID']>;
};

export type BankBranchFormGroup = FormGroup<BankBranchFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BankBranchFormService {
  createBankBranchFormGroup(bankBranch: BankBranchFormGroupInput = { id: null }): BankBranchFormGroup {
    const bankBranchRawValue = {
      ...this.getFormDefaults(),
      ...bankBranch,
    };
    return new FormGroup<BankBranchFormGroupContent>({
      id: new FormControl(
        { value: bankBranchRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      iD: new FormControl(bankBranchRawValue.iD),
      name: new FormControl(bankBranchRawValue.name),
      bankID: new FormControl(bankBranchRawValue.bankID),
    });
  }

  getBankBranch(form: BankBranchFormGroup): IBankBranch | NewBankBranch {
    return form.getRawValue() as IBankBranch | NewBankBranch;
  }

  resetForm(form: BankBranchFormGroup, bankBranch: BankBranchFormGroupInput): void {
    const bankBranchRawValue = { ...this.getFormDefaults(), ...bankBranch };
    form.reset(
      {
        ...bankBranchRawValue,
        id: { value: bankBranchRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BankBranchFormDefaults {
    return {
      id: null,
    };
  }
}
