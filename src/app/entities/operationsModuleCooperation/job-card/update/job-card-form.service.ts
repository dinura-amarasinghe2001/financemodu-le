import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJobCard, NewJobCard } from '../job-card.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobCard for edit and NewJobCardFormGroupInput for create.
 */
type JobCardFormGroupInput = IJobCard | PartialWithRequiredKeyOf<NewJobCard>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IJobCard | NewJobCard> = Omit<
  T,
  | 'startDate'
  | 'jobCompleteDate'
  | 'boothDate'
  | 'tinkeringStartDateTime'
  | 'tinkeringEndDateTime'
  | 'paintStartDateTime'
  | 'paintEndDateTime'
  | 'qcStartDateTime'
  | 'qcEndDateTime'
  | 'sparePartStartDateTime'
  | 'sparePartEndDateTime'
  | 'createdDate'
  | 'lastModifiedDate'
> & {
  startDate?: string | null;
  jobCompleteDate?: string | null;
  boothDate?: string | null;
  tinkeringStartDateTime?: string | null;
  tinkeringEndDateTime?: string | null;
  paintStartDateTime?: string | null;
  paintEndDateTime?: string | null;
  qcStartDateTime?: string | null;
  qcEndDateTime?: string | null;
  sparePartStartDateTime?: string | null;
  sparePartEndDateTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type JobCardFormRawValue = FormValueOf<IJobCard>;

type NewJobCardFormRawValue = FormValueOf<NewJobCard>;

type JobCardFormDefaults = Pick<
  NewJobCard,
  | 'id'
  | 'startDate'
  | 'jobCompleteDate'
  | 'boothDate'
  | 'tinkeringStartDateTime'
  | 'tinkeringEndDateTime'
  | 'paintStartDateTime'
  | 'paintEndDateTime'
  | 'qcStartDateTime'
  | 'qcEndDateTime'
  | 'sparePartStartDateTime'
  | 'sparePartEndDateTime'
  | 'createdDate'
  | 'lastModifiedDate'
>;

type JobCardFormGroupContent = {
  id: FormControl<JobCardFormRawValue['id'] | NewJobCard['id']>;
  vehicleID: FormControl<JobCardFormRawValue['vehicleID']>;
  vehicleBrand: FormControl<JobCardFormRawValue['vehicleBrand']>;
  vehicleModel: FormControl<JobCardFormRawValue['vehicleModel']>;
  vehicleLicenseNumber: FormControl<JobCardFormRawValue['vehicleLicenseNumber']>;
  vehicleOwnerID: FormControl<JobCardFormRawValue['vehicleOwnerID']>;
  vehicleOwnerName: FormControl<JobCardFormRawValue['vehicleOwnerName']>;
  vehicleOwnerContactNumber1: FormControl<JobCardFormRawValue['vehicleOwnerContactNumber1']>;
  vehicleOwnerContactNumber2: FormControl<JobCardFormRawValue['vehicleOwnerContactNumber2']>;
  estimateID: FormControl<JobCardFormRawValue['estimateID']>;
  insuranceCompany: FormControl<JobCardFormRawValue['insuranceCompany']>;
  serviceAdvisor: FormControl<JobCardFormRawValue['serviceAdvisor']>;
  serviceAdvisorID: FormControl<JobCardFormRawValue['serviceAdvisorID']>;
  numberOfPanels: FormControl<JobCardFormRawValue['numberOfPanels']>;
  fuelLevel: FormControl<JobCardFormRawValue['fuelLevel']>;
  meterReading: FormControl<JobCardFormRawValue['meterReading']>;
  startDate: FormControl<JobCardFormRawValue['startDate']>;
  jobCardNumber: FormControl<JobCardFormRawValue['jobCardNumber']>;
  jobCompleteDate: FormControl<JobCardFormRawValue['jobCompleteDate']>;
  boothDate: FormControl<JobCardFormRawValue['boothDate']>;
  opsUnitID: FormControl<JobCardFormRawValue['opsUnitID']>;
  tinkeringStartDateTime: FormControl<JobCardFormRawValue['tinkeringStartDateTime']>;
  tinkeringEndDateTime: FormControl<JobCardFormRawValue['tinkeringEndDateTime']>;
  paintStartDateTime: FormControl<JobCardFormRawValue['paintStartDateTime']>;
  paintEndDateTime: FormControl<JobCardFormRawValue['paintEndDateTime']>;
  qcStartDateTime: FormControl<JobCardFormRawValue['qcStartDateTime']>;
  qcEndDateTime: FormControl<JobCardFormRawValue['qcEndDateTime']>;
  sparePartStartDateTime: FormControl<JobCardFormRawValue['sparePartStartDateTime']>;
  sparePartEndDateTime: FormControl<JobCardFormRawValue['sparePartEndDateTime']>;
  createdBy: FormControl<JobCardFormRawValue['createdBy']>;
  createdDate: FormControl<JobCardFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<JobCardFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<JobCardFormRawValue['lastModifiedDate']>;
};

export type JobCardFormGroup = FormGroup<JobCardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobCardFormService {
  createJobCardFormGroup(jobCard: JobCardFormGroupInput = { id: null }): JobCardFormGroup {
    const jobCardRawValue = this.convertJobCardToJobCardRawValue({
      ...this.getFormDefaults(),
      ...jobCard,
    });
    return new FormGroup<JobCardFormGroupContent>({
      id: new FormControl(
        { value: jobCardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vehicleID: new FormControl(jobCardRawValue.vehicleID),
      vehicleBrand: new FormControl(jobCardRawValue.vehicleBrand),
      vehicleModel: new FormControl(jobCardRawValue.vehicleModel),
      vehicleLicenseNumber: new FormControl(jobCardRawValue.vehicleLicenseNumber),
      vehicleOwnerID: new FormControl(jobCardRawValue.vehicleOwnerID),
      vehicleOwnerName: new FormControl(jobCardRawValue.vehicleOwnerName),
      vehicleOwnerContactNumber1: new FormControl(jobCardRawValue.vehicleOwnerContactNumber1),
      vehicleOwnerContactNumber2: new FormControl(jobCardRawValue.vehicleOwnerContactNumber2),
      estimateID: new FormControl(jobCardRawValue.estimateID),
      insuranceCompany: new FormControl(jobCardRawValue.insuranceCompany),
      serviceAdvisor: new FormControl(jobCardRawValue.serviceAdvisor),
      serviceAdvisorID: new FormControl(jobCardRawValue.serviceAdvisorID),
      numberOfPanels: new FormControl(jobCardRawValue.numberOfPanels),
      fuelLevel: new FormControl(jobCardRawValue.fuelLevel),
      meterReading: new FormControl(jobCardRawValue.meterReading),
      startDate: new FormControl(jobCardRawValue.startDate),
      jobCardNumber: new FormControl(jobCardRawValue.jobCardNumber),
      jobCompleteDate: new FormControl(jobCardRawValue.jobCompleteDate),
      boothDate: new FormControl(jobCardRawValue.boothDate),
      opsUnitID: new FormControl(jobCardRawValue.opsUnitID),
      tinkeringStartDateTime: new FormControl(jobCardRawValue.tinkeringStartDateTime),
      tinkeringEndDateTime: new FormControl(jobCardRawValue.tinkeringEndDateTime),
      paintStartDateTime: new FormControl(jobCardRawValue.paintStartDateTime),
      paintEndDateTime: new FormControl(jobCardRawValue.paintEndDateTime),
      qcStartDateTime: new FormControl(jobCardRawValue.qcStartDateTime),
      qcEndDateTime: new FormControl(jobCardRawValue.qcEndDateTime),
      sparePartStartDateTime: new FormControl(jobCardRawValue.sparePartStartDateTime),
      sparePartEndDateTime: new FormControl(jobCardRawValue.sparePartEndDateTime),
      createdBy: new FormControl(jobCardRawValue.createdBy),
      createdDate: new FormControl(jobCardRawValue.createdDate),
      lastModifiedBy: new FormControl(jobCardRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(jobCardRawValue.lastModifiedDate),
    });
  }

  getJobCard(form: JobCardFormGroup): IJobCard | NewJobCard {
    return this.convertJobCardRawValueToJobCard(form.getRawValue() as JobCardFormRawValue | NewJobCardFormRawValue);
  }

  resetForm(form: JobCardFormGroup, jobCard: JobCardFormGroupInput): void {
    const jobCardRawValue = this.convertJobCardToJobCardRawValue({ ...this.getFormDefaults(), ...jobCard });
    form.reset(
      {
        ...jobCardRawValue,
        id: { value: jobCardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JobCardFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      jobCompleteDate: currentTime,
      boothDate: currentTime,
      tinkeringStartDateTime: currentTime,
      tinkeringEndDateTime: currentTime,
      paintStartDateTime: currentTime,
      paintEndDateTime: currentTime,
      qcStartDateTime: currentTime,
      qcEndDateTime: currentTime,
      sparePartStartDateTime: currentTime,
      sparePartEndDateTime: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertJobCardRawValueToJobCard(rawJobCard: JobCardFormRawValue | NewJobCardFormRawValue): IJobCard | NewJobCard {
    return {
      ...rawJobCard,
      startDate: dayjs(rawJobCard.startDate, DATE_TIME_FORMAT),
      jobCompleteDate: dayjs(rawJobCard.jobCompleteDate, DATE_TIME_FORMAT),
      boothDate: dayjs(rawJobCard.boothDate, DATE_TIME_FORMAT),
      tinkeringStartDateTime: dayjs(rawJobCard.tinkeringStartDateTime, DATE_TIME_FORMAT),
      tinkeringEndDateTime: dayjs(rawJobCard.tinkeringEndDateTime, DATE_TIME_FORMAT),
      paintStartDateTime: dayjs(rawJobCard.paintStartDateTime, DATE_TIME_FORMAT),
      paintEndDateTime: dayjs(rawJobCard.paintEndDateTime, DATE_TIME_FORMAT),
      qcStartDateTime: dayjs(rawJobCard.qcStartDateTime, DATE_TIME_FORMAT),
      qcEndDateTime: dayjs(rawJobCard.qcEndDateTime, DATE_TIME_FORMAT),
      sparePartStartDateTime: dayjs(rawJobCard.sparePartStartDateTime, DATE_TIME_FORMAT),
      sparePartEndDateTime: dayjs(rawJobCard.sparePartEndDateTime, DATE_TIME_FORMAT),
      createdDate: dayjs(rawJobCard.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawJobCard.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertJobCardToJobCardRawValue(
    jobCard: IJobCard | (Partial<NewJobCard> & JobCardFormDefaults),
  ): JobCardFormRawValue | PartialWithRequiredKeyOf<NewJobCardFormRawValue> {
    return {
      ...jobCard,
      startDate: jobCard.startDate ? jobCard.startDate.format(DATE_TIME_FORMAT) : undefined,
      jobCompleteDate: jobCard.jobCompleteDate ? jobCard.jobCompleteDate.format(DATE_TIME_FORMAT) : undefined,
      boothDate: jobCard.boothDate ? jobCard.boothDate.format(DATE_TIME_FORMAT) : undefined,
      tinkeringStartDateTime: jobCard.tinkeringStartDateTime ? jobCard.tinkeringStartDateTime.format(DATE_TIME_FORMAT) : undefined,
      tinkeringEndDateTime: jobCard.tinkeringEndDateTime ? jobCard.tinkeringEndDateTime.format(DATE_TIME_FORMAT) : undefined,
      paintStartDateTime: jobCard.paintStartDateTime ? jobCard.paintStartDateTime.format(DATE_TIME_FORMAT) : undefined,
      paintEndDateTime: jobCard.paintEndDateTime ? jobCard.paintEndDateTime.format(DATE_TIME_FORMAT) : undefined,
      qcStartDateTime: jobCard.qcStartDateTime ? jobCard.qcStartDateTime.format(DATE_TIME_FORMAT) : undefined,
      qcEndDateTime: jobCard.qcEndDateTime ? jobCard.qcEndDateTime.format(DATE_TIME_FORMAT) : undefined,
      sparePartStartDateTime: jobCard.sparePartStartDateTime ? jobCard.sparePartStartDateTime.format(DATE_TIME_FORMAT) : undefined,
      sparePartEndDateTime: jobCard.sparePartEndDateTime ? jobCard.sparePartEndDateTime.format(DATE_TIME_FORMAT) : undefined,
      createdDate: jobCard.createdDate ? jobCard.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: jobCard.lastModifiedDate ? jobCard.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
