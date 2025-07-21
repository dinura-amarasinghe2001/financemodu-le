import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPreEstimate, NewPreEstimate } from '../pre-estimate.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPreEstimate for edit and NewPreEstimateFormGroupInput for create.
 */
type PreEstimateFormGroupInput = IPreEstimate | PartialWithRequiredKeyOf<NewPreEstimate>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPreEstimate | NewPreEstimate> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PreEstimateFormRawValue = FormValueOf<IPreEstimate>;

type NewPreEstimateFormRawValue = FormValueOf<NewPreEstimate>;

type PreEstimateFormDefaults = Pick<NewPreEstimate, 'id' | 'isInsurance' | 'createdDate' | 'lastModifiedDate'>;

type PreEstimateFormGroupContent = {
  id: FormControl<PreEstimateFormRawValue['id'] | NewPreEstimate['id']>;
  vehicleID: FormControl<PreEstimateFormRawValue['vehicleID']>;
  vehicleBrand: FormControl<PreEstimateFormRawValue['vehicleBrand']>;
  vehicleModel: FormControl<PreEstimateFormRawValue['vehicleModel']>;
  licenseNo: FormControl<PreEstimateFormRawValue['licenseNo']>;
  vehicleOwnerID: FormControl<PreEstimateFormRawValue['vehicleOwnerID']>;
  vehicleOwnerName: FormControl<PreEstimateFormRawValue['vehicleOwnerName']>;
  vehicleOwnerContactNumber1: FormControl<PreEstimateFormRawValue['vehicleOwnerContactNumber1']>;
  vehicleOwnerContactNumber2: FormControl<PreEstimateFormRawValue['vehicleOwnerContactNumber2']>;
  preEstimateNumber: FormControl<PreEstimateFormRawValue['preEstimateNumber']>;
  numberOfPanels: FormControl<PreEstimateFormRawValue['numberOfPanels']>;
  jobType: FormControl<PreEstimateFormRawValue['jobType']>;
  isInsurance: FormControl<PreEstimateFormRawValue['isInsurance']>;
  insuranceName: FormControl<PreEstimateFormRawValue['insuranceName']>;
  insuranceID: FormControl<PreEstimateFormRawValue['insuranceID']>;
  opsUnitID: FormControl<PreEstimateFormRawValue['opsUnitID']>;
  createdBy: FormControl<PreEstimateFormRawValue['createdBy']>;
  createdDate: FormControl<PreEstimateFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PreEstimateFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PreEstimateFormRawValue['lastModifiedDate']>;
};

export type PreEstimateFormGroup = FormGroup<PreEstimateFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PreEstimateFormService {
  createPreEstimateFormGroup(preEstimate: PreEstimateFormGroupInput = { id: null }): PreEstimateFormGroup {
    const preEstimateRawValue = this.convertPreEstimateToPreEstimateRawValue({
      ...this.getFormDefaults(),
      ...preEstimate,
    });
    return new FormGroup<PreEstimateFormGroupContent>({
      id: new FormControl(
        { value: preEstimateRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vehicleID: new FormControl(preEstimateRawValue.vehicleID),
      vehicleBrand: new FormControl(preEstimateRawValue.vehicleBrand),
      vehicleModel: new FormControl(preEstimateRawValue.vehicleModel),
      licenseNo: new FormControl(preEstimateRawValue.licenseNo),
      vehicleOwnerID: new FormControl(preEstimateRawValue.vehicleOwnerID),
      vehicleOwnerName: new FormControl(preEstimateRawValue.vehicleOwnerName),
      vehicleOwnerContactNumber1: new FormControl(preEstimateRawValue.vehicleOwnerContactNumber1),
      vehicleOwnerContactNumber2: new FormControl(preEstimateRawValue.vehicleOwnerContactNumber2),
      preEstimateNumber: new FormControl(preEstimateRawValue.preEstimateNumber),
      numberOfPanels: new FormControl(preEstimateRawValue.numberOfPanels),
      jobType: new FormControl(preEstimateRawValue.jobType),
      isInsurance: new FormControl(preEstimateRawValue.isInsurance),
      insuranceName: new FormControl(preEstimateRawValue.insuranceName),
      insuranceID: new FormControl(preEstimateRawValue.insuranceID),
      opsUnitID: new FormControl(preEstimateRawValue.opsUnitID),
      createdBy: new FormControl(preEstimateRawValue.createdBy),
      createdDate: new FormControl(preEstimateRawValue.createdDate),
      lastModifiedBy: new FormControl(preEstimateRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(preEstimateRawValue.lastModifiedDate),
    });
  }

  getPreEstimate(form: PreEstimateFormGroup): IPreEstimate | NewPreEstimate {
    return this.convertPreEstimateRawValueToPreEstimate(form.getRawValue() as PreEstimateFormRawValue | NewPreEstimateFormRawValue);
  }

  resetForm(form: PreEstimateFormGroup, preEstimate: PreEstimateFormGroupInput): void {
    const preEstimateRawValue = this.convertPreEstimateToPreEstimateRawValue({ ...this.getFormDefaults(), ...preEstimate });
    form.reset(
      {
        ...preEstimateRawValue,
        id: { value: preEstimateRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PreEstimateFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isInsurance: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPreEstimateRawValueToPreEstimate(
    rawPreEstimate: PreEstimateFormRawValue | NewPreEstimateFormRawValue,
  ): IPreEstimate | NewPreEstimate {
    return {
      ...rawPreEstimate,
      createdDate: dayjs(rawPreEstimate.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPreEstimate.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPreEstimateToPreEstimateRawValue(
    preEstimate: IPreEstimate | (Partial<NewPreEstimate> & PreEstimateFormDefaults),
  ): PreEstimateFormRawValue | PartialWithRequiredKeyOf<NewPreEstimateFormRawValue> {
    return {
      ...preEstimate,
      createdDate: preEstimate.createdDate ? preEstimate.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: preEstimate.lastModifiedDate ? preEstimate.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
