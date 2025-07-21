import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEstimate, NewEstimate } from '../estimate.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEstimate for edit and NewEstimateFormGroupInput for create.
 */
type EstimateFormGroupInput = IEstimate | PartialWithRequiredKeyOf<NewEstimate>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEstimate | NewEstimate> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type EstimateFormRawValue = FormValueOf<IEstimate>;

type NewEstimateFormRawValue = FormValueOf<NewEstimate>;

type EstimateFormDefaults = Pick<NewEstimate, 'id' | 'isInsurance' | 'createdDate' | 'lastModifiedDate'>;

type EstimateFormGroupContent = {
  id: FormControl<EstimateFormRawValue['id'] | NewEstimate['id']>;
  vehicleID: FormControl<EstimateFormRawValue['vehicleID']>;
  vehicleBrand: FormControl<EstimateFormRawValue['vehicleBrand']>;
  vehicleModel: FormControl<EstimateFormRawValue['vehicleModel']>;
  licenseNo: FormControl<EstimateFormRawValue['licenseNo']>;
  vehicleOwnerID: FormControl<EstimateFormRawValue['vehicleOwnerID']>;
  vehicleOwnerName: FormControl<EstimateFormRawValue['vehicleOwnerName']>;
  vehicleOwnerContactNumber1: FormControl<EstimateFormRawValue['vehicleOwnerContactNumber1']>;
  vehicleOwnerContactNumber2: FormControl<EstimateFormRawValue['vehicleOwnerContactNumber2']>;
  isInsurance: FormControl<EstimateFormRawValue['isInsurance']>;
  insuranceName: FormControl<EstimateFormRawValue['insuranceName']>;
  insuranceID: FormControl<EstimateFormRawValue['insuranceID']>;
  opsUnitID: FormControl<EstimateFormRawValue['opsUnitID']>;
  totalPrice: FormControl<EstimateFormRawValue['totalPrice']>;
  estimateID: FormControl<EstimateFormRawValue['estimateID']>;
  preEstimateNumber: FormControl<EstimateFormRawValue['preEstimateNumber']>;
  estimateNumber: FormControl<EstimateFormRawValue['estimateNumber']>;
  numberOfPanels: FormControl<EstimateFormRawValue['numberOfPanels']>;
  serviceAdvisor: FormControl<EstimateFormRawValue['serviceAdvisor']>;
  serviceAdvisorID: FormControl<EstimateFormRawValue['serviceAdvisorID']>;
  createdBy: FormControl<EstimateFormRawValue['createdBy']>;
  createdDate: FormControl<EstimateFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<EstimateFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<EstimateFormRawValue['lastModifiedDate']>;
};

export type EstimateFormGroup = FormGroup<EstimateFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EstimateFormService {
  createEstimateFormGroup(estimate: EstimateFormGroupInput = { id: null }): EstimateFormGroup {
    const estimateRawValue = this.convertEstimateToEstimateRawValue({
      ...this.getFormDefaults(),
      ...estimate,
    });
    return new FormGroup<EstimateFormGroupContent>({
      id: new FormControl(
        { value: estimateRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vehicleID: new FormControl(estimateRawValue.vehicleID),
      vehicleBrand: new FormControl(estimateRawValue.vehicleBrand),
      vehicleModel: new FormControl(estimateRawValue.vehicleModel),
      licenseNo: new FormControl(estimateRawValue.licenseNo),
      vehicleOwnerID: new FormControl(estimateRawValue.vehicleOwnerID),
      vehicleOwnerName: new FormControl(estimateRawValue.vehicleOwnerName),
      vehicleOwnerContactNumber1: new FormControl(estimateRawValue.vehicleOwnerContactNumber1),
      vehicleOwnerContactNumber2: new FormControl(estimateRawValue.vehicleOwnerContactNumber2),
      isInsurance: new FormControl(estimateRawValue.isInsurance),
      insuranceName: new FormControl(estimateRawValue.insuranceName),
      insuranceID: new FormControl(estimateRawValue.insuranceID),
      opsUnitID: new FormControl(estimateRawValue.opsUnitID),
      totalPrice: new FormControl(estimateRawValue.totalPrice),
      estimateID: new FormControl(estimateRawValue.estimateID),
      preEstimateNumber: new FormControl(estimateRawValue.preEstimateNumber),
      estimateNumber: new FormControl(estimateRawValue.estimateNumber),
      numberOfPanels: new FormControl(estimateRawValue.numberOfPanels),
      serviceAdvisor: new FormControl(estimateRawValue.serviceAdvisor),
      serviceAdvisorID: new FormControl(estimateRawValue.serviceAdvisorID),
      createdBy: new FormControl(estimateRawValue.createdBy),
      createdDate: new FormControl(estimateRawValue.createdDate),
      lastModifiedBy: new FormControl(estimateRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(estimateRawValue.lastModifiedDate),
    });
  }

  getEstimate(form: EstimateFormGroup): IEstimate | NewEstimate {
    return this.convertEstimateRawValueToEstimate(form.getRawValue() as EstimateFormRawValue | NewEstimateFormRawValue);
  }

  resetForm(form: EstimateFormGroup, estimate: EstimateFormGroupInput): void {
    const estimateRawValue = this.convertEstimateToEstimateRawValue({ ...this.getFormDefaults(), ...estimate });
    form.reset(
      {
        ...estimateRawValue,
        id: { value: estimateRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EstimateFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isInsurance: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEstimateRawValueToEstimate(rawEstimate: EstimateFormRawValue | NewEstimateFormRawValue): IEstimate | NewEstimate {
    return {
      ...rawEstimate,
      createdDate: dayjs(rawEstimate.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEstimate.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEstimateToEstimateRawValue(
    estimate: IEstimate | (Partial<NewEstimate> & EstimateFormDefaults),
  ): EstimateFormRawValue | PartialWithRequiredKeyOf<NewEstimateFormRawValue> {
    return {
      ...estimate,
      createdDate: estimate.createdDate ? estimate.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: estimate.lastModifiedDate ? estimate.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
