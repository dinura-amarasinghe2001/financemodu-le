import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInsuranceRegistry, NewInsuranceRegistry } from '../insurance-registry.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInsuranceRegistry for edit and NewInsuranceRegistryFormGroupInput for create.
 */
type InsuranceRegistryFormGroupInput = IInsuranceRegistry | PartialWithRequiredKeyOf<NewInsuranceRegistry>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInsuranceRegistry | NewInsuranceRegistry> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type InsuranceRegistryFormRawValue = FormValueOf<IInsuranceRegistry>;

type NewInsuranceRegistryFormRawValue = FormValueOf<NewInsuranceRegistry>;

type InsuranceRegistryFormDefaults = Pick<NewInsuranceRegistry, 'id' | 'createdDate' | 'lastModifiedDate'>;

type InsuranceRegistryFormGroupContent = {
  id: FormControl<InsuranceRegistryFormRawValue['id'] | NewInsuranceRegistry['id']>;
  insuranceName: FormControl<InsuranceRegistryFormRawValue['insuranceName']>;
  remark: FormControl<InsuranceRegistryFormRawValue['remark']>;
  hotline: FormControl<InsuranceRegistryFormRawValue['hotline']>;
  opsUnitID: FormControl<InsuranceRegistryFormRawValue['opsUnitID']>;
  createdBy: FormControl<InsuranceRegistryFormRawValue['createdBy']>;
  createdDate: FormControl<InsuranceRegistryFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<InsuranceRegistryFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<InsuranceRegistryFormRawValue['lastModifiedDate']>;
};

export type InsuranceRegistryFormGroup = FormGroup<InsuranceRegistryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InsuranceRegistryFormService {
  createInsuranceRegistryFormGroup(insuranceRegistry: InsuranceRegistryFormGroupInput = { id: null }): InsuranceRegistryFormGroup {
    const insuranceRegistryRawValue = this.convertInsuranceRegistryToInsuranceRegistryRawValue({
      ...this.getFormDefaults(),
      ...insuranceRegistry,
    });
    return new FormGroup<InsuranceRegistryFormGroupContent>({
      id: new FormControl(
        { value: insuranceRegistryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      insuranceName: new FormControl(insuranceRegistryRawValue.insuranceName),
      remark: new FormControl(insuranceRegistryRawValue.remark),
      hotline: new FormControl(insuranceRegistryRawValue.hotline),
      opsUnitID: new FormControl(insuranceRegistryRawValue.opsUnitID),
      createdBy: new FormControl(insuranceRegistryRawValue.createdBy),
      createdDate: new FormControl(insuranceRegistryRawValue.createdDate),
      lastModifiedBy: new FormControl(insuranceRegistryRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(insuranceRegistryRawValue.lastModifiedDate),
    });
  }

  getInsuranceRegistry(form: InsuranceRegistryFormGroup): IInsuranceRegistry | NewInsuranceRegistry {
    return this.convertInsuranceRegistryRawValueToInsuranceRegistry(
      form.getRawValue() as InsuranceRegistryFormRawValue | NewInsuranceRegistryFormRawValue,
    );
  }

  resetForm(form: InsuranceRegistryFormGroup, insuranceRegistry: InsuranceRegistryFormGroupInput): void {
    const insuranceRegistryRawValue = this.convertInsuranceRegistryToInsuranceRegistryRawValue({
      ...this.getFormDefaults(),
      ...insuranceRegistry,
    });
    form.reset(
      {
        ...insuranceRegistryRawValue,
        id: { value: insuranceRegistryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InsuranceRegistryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertInsuranceRegistryRawValueToInsuranceRegistry(
    rawInsuranceRegistry: InsuranceRegistryFormRawValue | NewInsuranceRegistryFormRawValue,
  ): IInsuranceRegistry | NewInsuranceRegistry {
    return {
      ...rawInsuranceRegistry,
      createdDate: dayjs(rawInsuranceRegistry.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawInsuranceRegistry.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertInsuranceRegistryToInsuranceRegistryRawValue(
    insuranceRegistry: IInsuranceRegistry | (Partial<NewInsuranceRegistry> & InsuranceRegistryFormDefaults),
  ): InsuranceRegistryFormRawValue | PartialWithRequiredKeyOf<NewInsuranceRegistryFormRawValue> {
    return {
      ...insuranceRegistry,
      createdDate: insuranceRegistry.createdDate ? insuranceRegistry.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: insuranceRegistry.lastModifiedDate ? insuranceRegistry.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
