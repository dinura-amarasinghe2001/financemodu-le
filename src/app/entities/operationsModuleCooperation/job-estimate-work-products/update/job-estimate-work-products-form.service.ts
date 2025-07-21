import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IJobEstimateWorkProducts, NewJobEstimateWorkProducts } from '../job-estimate-work-products.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobEstimateWorkProducts for edit and NewJobEstimateWorkProductsFormGroupInput for create.
 */
type JobEstimateWorkProductsFormGroupInput = IJobEstimateWorkProducts | PartialWithRequiredKeyOf<NewJobEstimateWorkProducts>;

type JobEstimateWorkProductsFormDefaults = Pick<NewJobEstimateWorkProducts, 'id'>;

type JobEstimateWorkProductsFormGroupContent = {
  id: FormControl<IJobEstimateWorkProducts['id'] | NewJobEstimateWorkProducts['id']>;
  workProductName: FormControl<IJobEstimateWorkProducts['workProductName']>;
  quantity: FormControl<IJobEstimateWorkProducts['quantity']>;
  unit: FormControl<IJobEstimateWorkProducts['unit']>;
  notes: FormControl<IJobEstimateWorkProducts['notes']>;
  jobEstimateWorkLog: FormControl<IJobEstimateWorkProducts['jobEstimateWorkLog']>;
};

export type JobEstimateWorkProductsFormGroup = FormGroup<JobEstimateWorkProductsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobEstimateWorkProductsFormService {
  createJobEstimateWorkProductsFormGroup(
    jobEstimateWorkProducts: JobEstimateWorkProductsFormGroupInput = { id: null },
  ): JobEstimateWorkProductsFormGroup {
    const jobEstimateWorkProductsRawValue = {
      ...this.getFormDefaults(),
      ...jobEstimateWorkProducts,
    };
    return new FormGroup<JobEstimateWorkProductsFormGroupContent>({
      id: new FormControl(
        { value: jobEstimateWorkProductsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      workProductName: new FormControl(jobEstimateWorkProductsRawValue.workProductName),
      quantity: new FormControl(jobEstimateWorkProductsRawValue.quantity),
      unit: new FormControl(jobEstimateWorkProductsRawValue.unit),
      notes: new FormControl(jobEstimateWorkProductsRawValue.notes),
      jobEstimateWorkLog: new FormControl(jobEstimateWorkProductsRawValue.jobEstimateWorkLog),
    });
  }

  getJobEstimateWorkProducts(form: JobEstimateWorkProductsFormGroup): IJobEstimateWorkProducts | NewJobEstimateWorkProducts {
    return form.getRawValue() as IJobEstimateWorkProducts | NewJobEstimateWorkProducts;
  }

  resetForm(form: JobEstimateWorkProductsFormGroup, jobEstimateWorkProducts: JobEstimateWorkProductsFormGroupInput): void {
    const jobEstimateWorkProductsRawValue = { ...this.getFormDefaults(), ...jobEstimateWorkProducts };
    form.reset(
      {
        ...jobEstimateWorkProductsRawValue,
        id: { value: jobEstimateWorkProductsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JobEstimateWorkProductsFormDefaults {
    return {
      id: null,
    };
  }
}
