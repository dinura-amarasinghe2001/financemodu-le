import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEstimateTreatment, NewEstimateTreatment } from '../estimate-treatment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEstimateTreatment for edit and NewEstimateTreatmentFormGroupInput for create.
 */
type EstimateTreatmentFormGroupInput = IEstimateTreatment | PartialWithRequiredKeyOf<NewEstimateTreatment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEstimateTreatment | NewEstimateTreatment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type EstimateTreatmentFormRawValue = FormValueOf<IEstimateTreatment>;

type NewEstimateTreatmentFormRawValue = FormValueOf<NewEstimateTreatment>;

type EstimateTreatmentFormDefaults = Pick<
  NewEstimateTreatment,
  'id' | 'isSystemPrice' | 'isPriceConfirmed' | 'createdDate' | 'lastModifiedDate'
>;

type EstimateTreatmentFormGroupContent = {
  id: FormControl<EstimateTreatmentFormRawValue['id'] | NewEstimateTreatment['id']>;
  vehicleTreatmentID: FormControl<EstimateTreatmentFormRawValue['vehicleTreatmentID']>;
  fittingChargeName: FormControl<EstimateTreatmentFormRawValue['fittingChargeName']>;
  paintName: FormControl<EstimateTreatmentFormRawValue['paintName']>;
  partName: FormControl<EstimateTreatmentFormRawValue['partName']>;
  repairName: FormControl<EstimateTreatmentFormRawValue['repairName']>;
  other: FormControl<EstimateTreatmentFormRawValue['other']>;
  priceType: FormControl<EstimateTreatmentFormRawValue['priceType']>;
  customPrice: FormControl<EstimateTreatmentFormRawValue['customPrice']>;
  sh: FormControl<EstimateTreatmentFormRawValue['sh']>;
  marketPrice: FormControl<EstimateTreatmentFormRawValue['marketPrice']>;
  type: FormControl<EstimateTreatmentFormRawValue['type']>;
  partNumber: FormControl<EstimateTreatmentFormRawValue['partNumber']>;
  availableQuantity: FormControl<EstimateTreatmentFormRawValue['availableQuantity']>;
  unitPrice: FormControl<EstimateTreatmentFormRawValue['unitPrice']>;
  treatmentType: FormControl<EstimateTreatmentFormRawValue['treatmentType']>;
  quantity: FormControl<EstimateTreatmentFormRawValue['quantity']>;
  isSystemPrice: FormControl<EstimateTreatmentFormRawValue['isSystemPrice']>;
  isPriceConfirmed: FormControl<EstimateTreatmentFormRawValue['isPriceConfirmed']>;
  approvedDate: FormControl<EstimateTreatmentFormRawValue['approvedDate']>;
  price: FormControl<EstimateTreatmentFormRawValue['price']>;
  approvedPrice: FormControl<EstimateTreatmentFormRawValue['approvedPrice']>;
  approvedPriceState: FormControl<EstimateTreatmentFormRawValue['approvedPriceState']>;
  estimateTreatmentReason: FormControl<EstimateTreatmentFormRawValue['estimateTreatmentReason']>;
  opsUnitID: FormControl<EstimateTreatmentFormRawValue['opsUnitID']>;
  createdBy: FormControl<EstimateTreatmentFormRawValue['createdBy']>;
  createdDate: FormControl<EstimateTreatmentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<EstimateTreatmentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<EstimateTreatmentFormRawValue['lastModifiedDate']>;
  estimate: FormControl<EstimateTreatmentFormRawValue['estimate']>;
};

export type EstimateTreatmentFormGroup = FormGroup<EstimateTreatmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EstimateTreatmentFormService {
  createEstimateTreatmentFormGroup(estimateTreatment: EstimateTreatmentFormGroupInput = { id: null }): EstimateTreatmentFormGroup {
    const estimateTreatmentRawValue = this.convertEstimateTreatmentToEstimateTreatmentRawValue({
      ...this.getFormDefaults(),
      ...estimateTreatment,
    });
    return new FormGroup<EstimateTreatmentFormGroupContent>({
      id: new FormControl(
        { value: estimateTreatmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vehicleTreatmentID: new FormControl(estimateTreatmentRawValue.vehicleTreatmentID),
      fittingChargeName: new FormControl(estimateTreatmentRawValue.fittingChargeName),
      paintName: new FormControl(estimateTreatmentRawValue.paintName),
      partName: new FormControl(estimateTreatmentRawValue.partName),
      repairName: new FormControl(estimateTreatmentRawValue.repairName),
      other: new FormControl(estimateTreatmentRawValue.other),
      priceType: new FormControl(estimateTreatmentRawValue.priceType),
      customPrice: new FormControl(estimateTreatmentRawValue.customPrice),
      sh: new FormControl(estimateTreatmentRawValue.sh),
      marketPrice: new FormControl(estimateTreatmentRawValue.marketPrice),
      type: new FormControl(estimateTreatmentRawValue.type),
      partNumber: new FormControl(estimateTreatmentRawValue.partNumber),
      availableQuantity: new FormControl(estimateTreatmentRawValue.availableQuantity),
      unitPrice: new FormControl(estimateTreatmentRawValue.unitPrice),
      treatmentType: new FormControl(estimateTreatmentRawValue.treatmentType),
      quantity: new FormControl(estimateTreatmentRawValue.quantity),
      isSystemPrice: new FormControl(estimateTreatmentRawValue.isSystemPrice),
      isPriceConfirmed: new FormControl(estimateTreatmentRawValue.isPriceConfirmed),
      approvedDate: new FormControl(estimateTreatmentRawValue.approvedDate),
      price: new FormControl(estimateTreatmentRawValue.price),
      approvedPrice: new FormControl(estimateTreatmentRawValue.approvedPrice),
      approvedPriceState: new FormControl(estimateTreatmentRawValue.approvedPriceState),
      estimateTreatmentReason: new FormControl(estimateTreatmentRawValue.estimateTreatmentReason),
      opsUnitID: new FormControl(estimateTreatmentRawValue.opsUnitID),
      createdBy: new FormControl(estimateTreatmentRawValue.createdBy),
      createdDate: new FormControl(estimateTreatmentRawValue.createdDate),
      lastModifiedBy: new FormControl(estimateTreatmentRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(estimateTreatmentRawValue.lastModifiedDate),
      estimate: new FormControl(estimateTreatmentRawValue.estimate),
    });
  }

  getEstimateTreatment(form: EstimateTreatmentFormGroup): IEstimateTreatment | NewEstimateTreatment {
    return this.convertEstimateTreatmentRawValueToEstimateTreatment(
      form.getRawValue() as EstimateTreatmentFormRawValue | NewEstimateTreatmentFormRawValue,
    );
  }

  resetForm(form: EstimateTreatmentFormGroup, estimateTreatment: EstimateTreatmentFormGroupInput): void {
    const estimateTreatmentRawValue = this.convertEstimateTreatmentToEstimateTreatmentRawValue({
      ...this.getFormDefaults(),
      ...estimateTreatment,
    });
    form.reset(
      {
        ...estimateTreatmentRawValue,
        id: { value: estimateTreatmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EstimateTreatmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isSystemPrice: false,
      isPriceConfirmed: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEstimateTreatmentRawValueToEstimateTreatment(
    rawEstimateTreatment: EstimateTreatmentFormRawValue | NewEstimateTreatmentFormRawValue,
  ): IEstimateTreatment | NewEstimateTreatment {
    return {
      ...rawEstimateTreatment,
      createdDate: dayjs(rawEstimateTreatment.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEstimateTreatment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEstimateTreatmentToEstimateTreatmentRawValue(
    estimateTreatment: IEstimateTreatment | (Partial<NewEstimateTreatment> & EstimateTreatmentFormDefaults),
  ): EstimateTreatmentFormRawValue | PartialWithRequiredKeyOf<NewEstimateTreatmentFormRawValue> {
    return {
      ...estimateTreatment,
      createdDate: estimateTreatment.createdDate ? estimateTreatment.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: estimateTreatment.lastModifiedDate ? estimateTreatment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
