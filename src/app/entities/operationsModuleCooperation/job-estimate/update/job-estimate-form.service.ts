import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJobEstimate, NewJobEstimate } from '../job-estimate.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobEstimate for edit and NewJobEstimateFormGroupInput for create.
 */
type JobEstimateFormGroupInput = IJobEstimate | PartialWithRequiredKeyOf<NewJobEstimate>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IJobEstimate | NewJobEstimate> = Omit<
  T,
  'startDate' | 'endDate' | 'estStartDate' | 'estEndDate' | 'createdDate' | 'lastModifiedDate'
> & {
  startDate?: string | null;
  endDate?: string | null;
  estStartDate?: string | null;
  estEndDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type JobEstimateFormRawValue = FormValueOf<IJobEstimate>;

type NewJobEstimateFormRawValue = FormValueOf<NewJobEstimate>;

type JobEstimateFormDefaults = Pick<
  NewJobEstimate,
  'id' | 'startDate' | 'endDate' | 'estStartDate' | 'estEndDate' | 'createdDate' | 'lastModifiedDate'
>;

type JobEstimateFormGroupContent = {
  id: FormControl<JobEstimateFormRawValue['id'] | NewJobEstimate['id']>;
  jobID: FormControl<JobEstimateFormRawValue['jobID']>;
  departmentID: FormControl<JobEstimateFormRawValue['departmentID']>;
  startDate: FormControl<JobEstimateFormRawValue['startDate']>;
  endDate: FormControl<JobEstimateFormRawValue['endDate']>;
  currentState: FormControl<JobEstimateFormRawValue['currentState']>;
  remarks: FormControl<JobEstimateFormRawValue['remarks']>;
  estStartDate: FormControl<JobEstimateFormRawValue['estStartDate']>;
  estEndDate: FormControl<JobEstimateFormRawValue['estEndDate']>;
  opsUnitID: FormControl<JobEstimateFormRawValue['opsUnitID']>;
  estimateID: FormControl<JobEstimateFormRawValue['estimateID']>;
  vehicleLicenseNumber: FormControl<JobEstimateFormRawValue['vehicleLicenseNumber']>;
  createdBy: FormControl<JobEstimateFormRawValue['createdBy']>;
  createdDate: FormControl<JobEstimateFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<JobEstimateFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<JobEstimateFormRawValue['lastModifiedDate']>;
  jobCard: FormControl<JobEstimateFormRawValue['jobCard']>;
};

export type JobEstimateFormGroup = FormGroup<JobEstimateFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobEstimateFormService {
  createJobEstimateFormGroup(jobEstimate: JobEstimateFormGroupInput = { id: null }): JobEstimateFormGroup {
    const jobEstimateRawValue = this.convertJobEstimateToJobEstimateRawValue({
      ...this.getFormDefaults(),
      ...jobEstimate,
    });
    return new FormGroup<JobEstimateFormGroupContent>({
      id: new FormControl(
        { value: jobEstimateRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      jobID: new FormControl(jobEstimateRawValue.jobID),
      departmentID: new FormControl(jobEstimateRawValue.departmentID),
      startDate: new FormControl(jobEstimateRawValue.startDate),
      endDate: new FormControl(jobEstimateRawValue.endDate),
      currentState: new FormControl(jobEstimateRawValue.currentState),
      remarks: new FormControl(jobEstimateRawValue.remarks),
      estStartDate: new FormControl(jobEstimateRawValue.estStartDate),
      estEndDate: new FormControl(jobEstimateRawValue.estEndDate),
      opsUnitID: new FormControl(jobEstimateRawValue.opsUnitID),
      estimateID: new FormControl(jobEstimateRawValue.estimateID),
      vehicleLicenseNumber: new FormControl(jobEstimateRawValue.vehicleLicenseNumber),
      createdBy: new FormControl(jobEstimateRawValue.createdBy),
      createdDate: new FormControl(jobEstimateRawValue.createdDate),
      lastModifiedBy: new FormControl(jobEstimateRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(jobEstimateRawValue.lastModifiedDate),
      jobCard: new FormControl(jobEstimateRawValue.jobCard),
    });
  }

  getJobEstimate(form: JobEstimateFormGroup): IJobEstimate | NewJobEstimate {
    return this.convertJobEstimateRawValueToJobEstimate(form.getRawValue() as JobEstimateFormRawValue | NewJobEstimateFormRawValue);
  }

  resetForm(form: JobEstimateFormGroup, jobEstimate: JobEstimateFormGroupInput): void {
    const jobEstimateRawValue = this.convertJobEstimateToJobEstimateRawValue({ ...this.getFormDefaults(), ...jobEstimate });
    form.reset(
      {
        ...jobEstimateRawValue,
        id: { value: jobEstimateRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JobEstimateFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
      estStartDate: currentTime,
      estEndDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertJobEstimateRawValueToJobEstimate(
    rawJobEstimate: JobEstimateFormRawValue | NewJobEstimateFormRawValue,
  ): IJobEstimate | NewJobEstimate {
    return {
      ...rawJobEstimate,
      startDate: dayjs(rawJobEstimate.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawJobEstimate.endDate, DATE_TIME_FORMAT),
      estStartDate: dayjs(rawJobEstimate.estStartDate, DATE_TIME_FORMAT),
      estEndDate: dayjs(rawJobEstimate.estEndDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawJobEstimate.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawJobEstimate.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertJobEstimateToJobEstimateRawValue(
    jobEstimate: IJobEstimate | (Partial<NewJobEstimate> & JobEstimateFormDefaults),
  ): JobEstimateFormRawValue | PartialWithRequiredKeyOf<NewJobEstimateFormRawValue> {
    return {
      ...jobEstimate,
      startDate: jobEstimate.startDate ? jobEstimate.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: jobEstimate.endDate ? jobEstimate.endDate.format(DATE_TIME_FORMAT) : undefined,
      estStartDate: jobEstimate.estStartDate ? jobEstimate.estStartDate.format(DATE_TIME_FORMAT) : undefined,
      estEndDate: jobEstimate.estEndDate ? jobEstimate.estEndDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: jobEstimate.createdDate ? jobEstimate.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: jobEstimate.lastModifiedDate ? jobEstimate.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
