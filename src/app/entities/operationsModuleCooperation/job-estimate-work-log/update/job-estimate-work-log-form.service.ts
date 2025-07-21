import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJobEstimateWorkLog, NewJobEstimateWorkLog } from '../job-estimate-work-log.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobEstimateWorkLog for edit and NewJobEstimateWorkLogFormGroupInput for create.
 */
type JobEstimateWorkLogFormGroupInput = IJobEstimateWorkLog | PartialWithRequiredKeyOf<NewJobEstimateWorkLog>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IJobEstimateWorkLog | NewJobEstimateWorkLog> = Omit<T, 'workDate' | 'createdDate' | 'lastModifiedDate'> & {
  workDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type JobEstimateWorkLogFormRawValue = FormValueOf<IJobEstimateWorkLog>;

type NewJobEstimateWorkLogFormRawValue = FormValueOf<NewJobEstimateWorkLog>;

type JobEstimateWorkLogFormDefaults = Pick<NewJobEstimateWorkLog, 'id' | 'workDate' | 'createdDate' | 'lastModifiedDate'>;

type JobEstimateWorkLogFormGroupContent = {
  id: FormControl<JobEstimateWorkLogFormRawValue['id'] | NewJobEstimateWorkLog['id']>;
  workedEmployeeName: FormControl<JobEstimateWorkLogFormRawValue['workedEmployeeName']>;
  workedHours: FormControl<JobEstimateWorkLogFormRawValue['workedHours']>;
  workDate: FormControl<JobEstimateWorkLogFormRawValue['workDate']>;
  createdBy: FormControl<JobEstimateWorkLogFormRawValue['createdBy']>;
  createdDate: FormControl<JobEstimateWorkLogFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<JobEstimateWorkLogFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<JobEstimateWorkLogFormRawValue['lastModifiedDate']>;
  jobEstimate: FormControl<JobEstimateWorkLogFormRawValue['jobEstimate']>;
};

export type JobEstimateWorkLogFormGroup = FormGroup<JobEstimateWorkLogFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobEstimateWorkLogFormService {
  createJobEstimateWorkLogFormGroup(jobEstimateWorkLog: JobEstimateWorkLogFormGroupInput = { id: null }): JobEstimateWorkLogFormGroup {
    const jobEstimateWorkLogRawValue = this.convertJobEstimateWorkLogToJobEstimateWorkLogRawValue({
      ...this.getFormDefaults(),
      ...jobEstimateWorkLog,
    });
    return new FormGroup<JobEstimateWorkLogFormGroupContent>({
      id: new FormControl(
        { value: jobEstimateWorkLogRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      workedEmployeeName: new FormControl(jobEstimateWorkLogRawValue.workedEmployeeName),
      workedHours: new FormControl(jobEstimateWorkLogRawValue.workedHours),
      workDate: new FormControl(jobEstimateWorkLogRawValue.workDate),
      createdBy: new FormControl(jobEstimateWorkLogRawValue.createdBy),
      createdDate: new FormControl(jobEstimateWorkLogRawValue.createdDate),
      lastModifiedBy: new FormControl(jobEstimateWorkLogRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(jobEstimateWorkLogRawValue.lastModifiedDate),
      jobEstimate: new FormControl(jobEstimateWorkLogRawValue.jobEstimate),
    });
  }

  getJobEstimateWorkLog(form: JobEstimateWorkLogFormGroup): IJobEstimateWorkLog | NewJobEstimateWorkLog {
    return this.convertJobEstimateWorkLogRawValueToJobEstimateWorkLog(
      form.getRawValue() as JobEstimateWorkLogFormRawValue | NewJobEstimateWorkLogFormRawValue,
    );
  }

  resetForm(form: JobEstimateWorkLogFormGroup, jobEstimateWorkLog: JobEstimateWorkLogFormGroupInput): void {
    const jobEstimateWorkLogRawValue = this.convertJobEstimateWorkLogToJobEstimateWorkLogRawValue({
      ...this.getFormDefaults(),
      ...jobEstimateWorkLog,
    });
    form.reset(
      {
        ...jobEstimateWorkLogRawValue,
        id: { value: jobEstimateWorkLogRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JobEstimateWorkLogFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      workDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertJobEstimateWorkLogRawValueToJobEstimateWorkLog(
    rawJobEstimateWorkLog: JobEstimateWorkLogFormRawValue | NewJobEstimateWorkLogFormRawValue,
  ): IJobEstimateWorkLog | NewJobEstimateWorkLog {
    return {
      ...rawJobEstimateWorkLog,
      workDate: dayjs(rawJobEstimateWorkLog.workDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawJobEstimateWorkLog.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawJobEstimateWorkLog.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertJobEstimateWorkLogToJobEstimateWorkLogRawValue(
    jobEstimateWorkLog: IJobEstimateWorkLog | (Partial<NewJobEstimateWorkLog> & JobEstimateWorkLogFormDefaults),
  ): JobEstimateWorkLogFormRawValue | PartialWithRequiredKeyOf<NewJobEstimateWorkLogFormRawValue> {
    return {
      ...jobEstimateWorkLog,
      workDate: jobEstimateWorkLog.workDate ? jobEstimateWorkLog.workDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: jobEstimateWorkLog.createdDate ? jobEstimateWorkLog.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: jobEstimateWorkLog.lastModifiedDate ? jobEstimateWorkLog.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
