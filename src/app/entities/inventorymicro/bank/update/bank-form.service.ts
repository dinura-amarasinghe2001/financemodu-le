import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IBank, NewBank } from '../bank.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBank for edit and NewBankFormGroupInput for create.
 */
type BankFormGroupInput = IBank | PartialWithRequiredKeyOf<NewBank>;

type BankFormDefaults = Pick<NewBank, 'id'>;

type BankFormGroupContent = {
  id: FormControl<IBank['id'] | NewBank['id']>;
  iD: FormControl<IBank['iD']>;
  name: FormControl<IBank['name']>;
};

export type BankFormGroup = FormGroup<BankFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BankFormService {
  createBankFormGroup(bank: BankFormGroupInput = { id: null }): BankFormGroup {
    const bankRawValue = {
      ...this.getFormDefaults(),
      ...bank,
    };
    return new FormGroup<BankFormGroupContent>({
      id: new FormControl(
        { value: bankRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      iD: new FormControl(bankRawValue.iD),
      name: new FormControl(bankRawValue.name),
    });
  }

  getBank(form: BankFormGroup): IBank | NewBank {
    return form.getRawValue() as IBank | NewBank;
  }

  resetForm(form: BankFormGroup, bank: BankFormGroupInput): void {
    const bankRawValue = { ...this.getFormDefaults(), ...bank };
    form.reset(
      {
        ...bankRawValue,
        id: { value: bankRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BankFormDefaults {
    return {
      id: null,
    };
  }
}
