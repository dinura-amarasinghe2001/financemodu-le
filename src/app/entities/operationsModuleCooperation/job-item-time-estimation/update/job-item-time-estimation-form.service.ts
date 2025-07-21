import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJobItemTimeEstimation, NewJobItemTimeEstimation } from '../job-item-time-estimation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobItemTimeEstimation for edit and NewJobItemTimeEstimationFormGroupInput for create.
 */
type JobItemTimeEstimationFormGroupInput = IJobItemTimeEstimation | PartialWithRequiredKeyOf<NewJobItemTimeEstimation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IJobItemTimeEstimation | NewJobItemTimeEstimation> = Omit<
  T,
  'startDateTime' | 'endDateTime' | 'createdDate' | 'lastModifiedDate'
> & {
  startDateTime?: string | null;
  endDateTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type JobItemTimeEstimationFormRawValue = FormValueOf<IJobItemTimeEstimation>;

type NewJobItemTimeEstimationFormRawValue = FormValueOf<NewJobItemTimeEstimation>;

type JobItemTimeEstimationFormDefaults = Pick<
  NewJobItemTimeEstimation,
  'id' | 'startDateTime' | 'endDateTime' | 'createdDate' | 'lastModifiedDate'
>;

type JobItemTimeEstimationFormGroupContent = {
  id: FormControl<JobItemTimeEstimationFormRawValue['id'] | NewJobItemTimeEstimation['id']>;
  startDateTime: FormControl<JobItemTimeEstimationFormRawValue['startDateTime']>;
  endDateTime: FormControl<JobItemTimeEstimationFormRawValue['endDateTime']>;
  remark: FormControl<JobItemTimeEstimationFormRawValue['remark']>;
  jobItemType: FormControl<JobItemTimeEstimationFormRawValue['jobItemType']>;
  opsUnitID: FormControl<JobItemTimeEstimationFormRawValue['opsUnitID']>;
  createdBy: FormControl<JobItemTimeEstimationFormRawValue['createdBy']>;
  createdDate: FormControl<JobItemTimeEstimationFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<JobItemTimeEstimationFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<JobItemTimeEstimationFormRawValue['lastModifiedDate']>;
  jobCard: FormControl<JobItemTimeEstimationFormRawValue['jobCard']>;
};

export type JobItemTimeEstimationFormGroup = FormGroup<JobItemTimeEstimationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobItemTimeEstimationFormService {
  createJobItemTimeEstimationFormGroup(
    jobItemTimeEstimation: JobItemTimeEstimationFormGroupInput = { id: null },
  ): JobItemTimeEstimationFormGroup {
    const jobItemTimeEstimationRawValue = this.convertJobItemTimeEstimationToJobItemTimeEstimationRawValue({
      ...this.getFormDefaults(),
      ...jobItemTimeEstimation,
    });
    return new FormGroup<JobItemTimeEstimationFormGroupContent>({
      id: new FormControl(
        { value: jobItemTimeEstimationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startDateTime: new FormControl(jobItemTimeEstimationRawValue.startDateTime),
      endDateTime: new FormControl(jobItemTimeEstimationRawValue.endDateTime),
      remark: new FormControl(jobItemTimeEstimationRawValue.remark),
      jobItemType: new FormControl(jobItemTimeEstimationRawValue.jobItemType),
      opsUnitID: new FormControl(jobItemTimeEstimationRawValue.opsUnitID),
      createdBy: new FormControl(jobItemTimeEstimationRawValue.createdBy),
      createdDate: new FormControl(jobItemTimeEstimationRawValue.createdDate),
      lastModifiedBy: new FormControl(jobItemTimeEstimationRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(jobItemTimeEstimationRawValue.lastModifiedDate),
      jobCard: new FormControl(jobItemTimeEstimationRawValue.jobCard),
    });
  }

  getJobItemTimeEstimation(form: JobItemTimeEstimationFormGroup): IJobItemTimeEstimation | NewJobItemTimeEstimation {
    return this.convertJobItemTimeEstimationRawValueToJobItemTimeEstimation(
      form.getRawValue() as JobItemTimeEstimationFormRawValue | NewJobItemTimeEstimationFormRawValue,
    );
  }

  resetForm(form: JobItemTimeEstimationFormGroup, jobItemTimeEstimation: JobItemTimeEstimationFormGroupInput): void {
    const jobItemTimeEstimationRawValue = this.convertJobItemTimeEstimationToJobItemTimeEstimationRawValue({
      ...this.getFormDefaults(),
      ...jobItemTimeEstimation,
    });
    form.reset(
      {
        ...jobItemTimeEstimationRawValue,
        id: { value: jobItemTimeEstimationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JobItemTimeEstimationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDateTime: currentTime,
      endDateTime: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertJobItemTimeEstimationRawValueToJobItemTimeEstimation(
    rawJobItemTimeEstimation: JobItemTimeEstimationFormRawValue | NewJobItemTimeEstimationFormRawValue,
  ): IJobItemTimeEstimation | NewJobItemTimeEstimation {
    return {
      ...rawJobItemTimeEstimation,
      startDateTime: dayjs(rawJobItemTimeEstimation.startDateTime, DATE_TIME_FORMAT),
      endDateTime: dayjs(rawJobItemTimeEstimation.endDateTime, DATE_TIME_FORMAT),
      createdDate: dayjs(rawJobItemTimeEstimation.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawJobItemTimeEstimation.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertJobItemTimeEstimationToJobItemTimeEstimationRawValue(
    jobItemTimeEstimation: IJobItemTimeEstimation | (Partial<NewJobItemTimeEstimation> & JobItemTimeEstimationFormDefaults),
  ): JobItemTimeEstimationFormRawValue | PartialWithRequiredKeyOf<NewJobItemTimeEstimationFormRawValue> {
    return {
      ...jobItemTimeEstimation,
      startDateTime: jobItemTimeEstimation.startDateTime ? jobItemTimeEstimation.startDateTime.format(DATE_TIME_FORMAT) : undefined,
      endDateTime: jobItemTimeEstimation.endDateTime ? jobItemTimeEstimation.endDateTime.format(DATE_TIME_FORMAT) : undefined,
      createdDate: jobItemTimeEstimation.createdDate ? jobItemTimeEstimation.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: jobItemTimeEstimation.lastModifiedDate
        ? jobItemTimeEstimation.lastModifiedDate.format(DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
