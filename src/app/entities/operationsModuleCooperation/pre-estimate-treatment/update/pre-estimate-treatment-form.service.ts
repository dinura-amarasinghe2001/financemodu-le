import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPreEstimateTreatment, NewPreEstimateTreatment } from '../pre-estimate-treatment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPreEstimateTreatment for edit and NewPreEstimateTreatmentFormGroupInput for create.
 */
type PreEstimateTreatmentFormGroupInput = IPreEstimateTreatment | PartialWithRequiredKeyOf<NewPreEstimateTreatment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPreEstimateTreatment | NewPreEstimateTreatment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PreEstimateTreatmentFormRawValue = FormValueOf<IPreEstimateTreatment>;

type NewPreEstimateTreatmentFormRawValue = FormValueOf<NewPreEstimateTreatment>;

type PreEstimateTreatmentFormDefaults = Pick<NewPreEstimateTreatment, 'id' | 'isSystemPrice' | 'createdDate' | 'lastModifiedDate'>;

type PreEstimateTreatmentFormGroupContent = {
  id: FormControl<PreEstimateTreatmentFormRawValue['id'] | NewPreEstimateTreatment['id']>;
  vehicleTreatmentID: FormControl<PreEstimateTreatmentFormRawValue['vehicleTreatmentID']>;
  fittingChargeName: FormControl<PreEstimateTreatmentFormRawValue['fittingChargeName']>;
  paintName: FormControl<PreEstimateTreatmentFormRawValue['paintName']>;
  partName: FormControl<PreEstimateTreatmentFormRawValue['partName']>;
  partNumber: FormControl<PreEstimateTreatmentFormRawValue['partNumber']>;
  repairName: FormControl<PreEstimateTreatmentFormRawValue['repairName']>;
  other: FormControl<PreEstimateTreatmentFormRawValue['other']>;
  sh: FormControl<PreEstimateTreatmentFormRawValue['sh']>;
  marketPrice: FormControl<PreEstimateTreatmentFormRawValue['marketPrice']>;
  priceType: FormControl<PreEstimateTreatmentFormRawValue['priceType']>;
  type: FormControl<PreEstimateTreatmentFormRawValue['type']>;
  customPrice: FormControl<PreEstimateTreatmentFormRawValue['customPrice']>;
  unitPrice: FormControl<PreEstimateTreatmentFormRawValue['unitPrice']>;
  price: FormControl<PreEstimateTreatmentFormRawValue['price']>;
  totalPrice: FormControl<PreEstimateTreatmentFormRawValue['totalPrice']>;
  isSystemPrice: FormControl<PreEstimateTreatmentFormRawValue['isSystemPrice']>;
  availableQuantity: FormControl<PreEstimateTreatmentFormRawValue['availableQuantity']>;
  treatmentType: FormControl<PreEstimateTreatmentFormRawValue['treatmentType']>;
  quantity: FormControl<PreEstimateTreatmentFormRawValue['quantity']>;
  opsUnitID: FormControl<PreEstimateTreatmentFormRawValue['opsUnitID']>;
  createdBy: FormControl<PreEstimateTreatmentFormRawValue['createdBy']>;
  createdDate: FormControl<PreEstimateTreatmentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PreEstimateTreatmentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PreEstimateTreatmentFormRawValue['lastModifiedDate']>;
  preEstimate: FormControl<PreEstimateTreatmentFormRawValue['preEstimate']>;
};

export type PreEstimateTreatmentFormGroup = FormGroup<PreEstimateTreatmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PreEstimateTreatmentFormService {
  createPreEstimateTreatmentFormGroup(
    preEstimateTreatment: PreEstimateTreatmentFormGroupInput = { id: null },
  ): PreEstimateTreatmentFormGroup {
    const preEstimateTreatmentRawValue = this.convertPreEstimateTreatmentToPreEstimateTreatmentRawValue({
      ...this.getFormDefaults(),
      ...preEstimateTreatment,
    });
    return new FormGroup<PreEstimateTreatmentFormGroupContent>({
      id: new FormControl(
        { value: preEstimateTreatmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vehicleTreatmentID: new FormControl(preEstimateTreatmentRawValue.vehicleTreatmentID),
      fittingChargeName: new FormControl(preEstimateTreatmentRawValue.fittingChargeName),
      paintName: new FormControl(preEstimateTreatmentRawValue.paintName),
      partName: new FormControl(preEstimateTreatmentRawValue.partName),
      partNumber: new FormControl(preEstimateTreatmentRawValue.partNumber),
      repairName: new FormControl(preEstimateTreatmentRawValue.repairName),
      other: new FormControl(preEstimateTreatmentRawValue.other),
      sh: new FormControl(preEstimateTreatmentRawValue.sh),
      marketPrice: new FormControl(preEstimateTreatmentRawValue.marketPrice),
      priceType: new FormControl(preEstimateTreatmentRawValue.priceType),
      type: new FormControl(preEstimateTreatmentRawValue.type),
      customPrice: new FormControl(preEstimateTreatmentRawValue.customPrice),
      unitPrice: new FormControl(preEstimateTreatmentRawValue.unitPrice),
      price: new FormControl(preEstimateTreatmentRawValue.price),
      totalPrice: new FormControl(preEstimateTreatmentRawValue.totalPrice),
      isSystemPrice: new FormControl(preEstimateTreatmentRawValue.isSystemPrice),
      availableQuantity: new FormControl(preEstimateTreatmentRawValue.availableQuantity),
      treatmentType: new FormControl(preEstimateTreatmentRawValue.treatmentType),
      quantity: new FormControl(preEstimateTreatmentRawValue.quantity),
      opsUnitID: new FormControl(preEstimateTreatmentRawValue.opsUnitID),
      createdBy: new FormControl(preEstimateTreatmentRawValue.createdBy),
      createdDate: new FormControl(preEstimateTreatmentRawValue.createdDate),
      lastModifiedBy: new FormControl(preEstimateTreatmentRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(preEstimateTreatmentRawValue.lastModifiedDate),
      preEstimate: new FormControl(preEstimateTreatmentRawValue.preEstimate),
    });
  }

  getPreEstimateTreatment(form: PreEstimateTreatmentFormGroup): IPreEstimateTreatment | NewPreEstimateTreatment {
    return this.convertPreEstimateTreatmentRawValueToPreEstimateTreatment(
      form.getRawValue() as PreEstimateTreatmentFormRawValue | NewPreEstimateTreatmentFormRawValue,
    );
  }

  resetForm(form: PreEstimateTreatmentFormGroup, preEstimateTreatment: PreEstimateTreatmentFormGroupInput): void {
    const preEstimateTreatmentRawValue = this.convertPreEstimateTreatmentToPreEstimateTreatmentRawValue({
      ...this.getFormDefaults(),
      ...preEstimateTreatment,
    });
    form.reset(
      {
        ...preEstimateTreatmentRawValue,
        id: { value: preEstimateTreatmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PreEstimateTreatmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isSystemPrice: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPreEstimateTreatmentRawValueToPreEstimateTreatment(
    rawPreEstimateTreatment: PreEstimateTreatmentFormRawValue | NewPreEstimateTreatmentFormRawValue,
  ): IPreEstimateTreatment | NewPreEstimateTreatment {
    return {
      ...rawPreEstimateTreatment,
      createdDate: dayjs(rawPreEstimateTreatment.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPreEstimateTreatment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPreEstimateTreatmentToPreEstimateTreatmentRawValue(
    preEstimateTreatment: IPreEstimateTreatment | (Partial<NewPreEstimateTreatment> & PreEstimateTreatmentFormDefaults),
  ): PreEstimateTreatmentFormRawValue | PartialWithRequiredKeyOf<NewPreEstimateTreatmentFormRawValue> {
    return {
      ...preEstimateTreatment,
      createdDate: preEstimateTreatment.createdDate ? preEstimateTreatment.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: preEstimateTreatment.lastModifiedDate ? preEstimateTreatment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
