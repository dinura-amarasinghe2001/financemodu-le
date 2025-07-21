import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IVat, NewVat } from '../vat.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVat for edit and NewVatFormGroupInput for create.
 */
type VatFormGroupInput = IVat | PartialWithRequiredKeyOf<NewVat>;

type VatFormDefaults = Pick<NewVat, 'id'>;

type VatFormGroupContent = {
  id: FormControl<IVat['id'] | NewVat['id']>;
  vatRate: FormControl<IVat['vatRate']>;
  vatAmount: FormControl<IVat['vatAmount']>;
  vatName: FormControl<IVat['vatName']>;
};

export type VatFormGroup = FormGroup<VatFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VatFormService {
  createVatFormGroup(vat: VatFormGroupInput = { id: null }): VatFormGroup {
    const vatRawValue = {
      ...this.getFormDefaults(),
      ...vat,
    };
    return new FormGroup<VatFormGroupContent>({
      id: new FormControl(
        { value: vatRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vatRate: new FormControl(vatRawValue.vatRate),
      vatAmount: new FormControl(vatRawValue.vatAmount),
      vatName: new FormControl(vatRawValue.vatName),
    });
  }

  getVat(form: VatFormGroup): IVat | NewVat {
    return form.getRawValue() as IVat | NewVat;
  }

  resetForm(form: VatFormGroup, vat: VatFormGroupInput): void {
    const vatRawValue = { ...this.getFormDefaults(), ...vat };
    form.reset(
      {
        ...vatRawValue,
        id: { value: vatRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VatFormDefaults {
    return {
      id: null,
    };
  }
}
