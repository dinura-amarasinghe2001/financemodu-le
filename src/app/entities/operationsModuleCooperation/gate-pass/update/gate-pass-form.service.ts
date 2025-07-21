import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGatePass, NewGatePass } from '../gate-pass.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGatePass for edit and NewGatePassFormGroupInput for create.
 */
type GatePassFormGroupInput = IGatePass | PartialWithRequiredKeyOf<NewGatePass>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGatePass | NewGatePass> = Omit<T, 'entryDateTime' | 'createdDate' | 'lastModifiedDate'> & {
  entryDateTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type GatePassFormRawValue = FormValueOf<IGatePass>;

type NewGatePassFormRawValue = FormValueOf<NewGatePass>;

type GatePassFormDefaults = Pick<NewGatePass, 'id' | 'entryDateTime' | 'createdDate' | 'lastModifiedDate'>;

type GatePassFormGroupContent = {
  id: FormControl<GatePassFormRawValue['id'] | NewGatePass['id']>;
  vehicleID: FormControl<GatePassFormRawValue['vehicleID']>;
  vehicleBrand: FormControl<GatePassFormRawValue['vehicleBrand']>;
  vehicleModel: FormControl<GatePassFormRawValue['vehicleModel']>;
  vehicleLicenseNumber: FormControl<GatePassFormRawValue['vehicleLicenseNumber']>;
  vehicleOwnerID: FormControl<GatePassFormRawValue['vehicleOwnerID']>;
  vehicleOwnerName: FormControl<GatePassFormRawValue['vehicleOwnerName']>;
  vehicleOwnerContactNumber1: FormControl<GatePassFormRawValue['vehicleOwnerContactNumber1']>;
  vehicleOwnerContactNumber2: FormControl<GatePassFormRawValue['vehicleOwnerContactNumber2']>;
  fuelLevel: FormControl<GatePassFormRawValue['fuelLevel']>;
  meterReading: FormControl<GatePassFormRawValue['meterReading']>;
  status: FormControl<GatePassFormRawValue['status']>;
  frontView1: FormControl<GatePassFormRawValue['frontView1']>;
  sideRView1: FormControl<GatePassFormRawValue['sideRView1']>;
  sideLView1: FormControl<GatePassFormRawValue['sideLView1']>;
  rearView1: FormControl<GatePassFormRawValue['rearView1']>;
  jobCardNumber: FormControl<GatePassFormRawValue['jobCardNumber']>;
  receiptValue: FormControl<GatePassFormRawValue['receiptValue']>;
  entryDateTime: FormControl<GatePassFormRawValue['entryDateTime']>;
  opsUnitID: FormControl<GatePassFormRawValue['opsUnitID']>;
  invoiceNumber: FormControl<GatePassFormRawValue['invoiceNumber']>;
  ownerBelongings: FormControl<GatePassFormRawValue['ownerBelongings']>;
  createdBy: FormControl<GatePassFormRawValue['createdBy']>;
  createdDate: FormControl<GatePassFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<GatePassFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<GatePassFormRawValue['lastModifiedDate']>;
  jobCard: FormControl<GatePassFormRawValue['jobCard']>;
};

export type GatePassFormGroup = FormGroup<GatePassFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GatePassFormService {
  createGatePassFormGroup(gatePass: GatePassFormGroupInput = { id: null }): GatePassFormGroup {
    const gatePassRawValue = this.convertGatePassToGatePassRawValue({
      ...this.getFormDefaults(),
      ...gatePass,
    });
    return new FormGroup<GatePassFormGroupContent>({
      id: new FormControl(
        { value: gatePassRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vehicleID: new FormControl(gatePassRawValue.vehicleID),
      vehicleBrand: new FormControl(gatePassRawValue.vehicleBrand),
      vehicleModel: new FormControl(gatePassRawValue.vehicleModel),
      vehicleLicenseNumber: new FormControl(gatePassRawValue.vehicleLicenseNumber),
      vehicleOwnerID: new FormControl(gatePassRawValue.vehicleOwnerID),
      vehicleOwnerName: new FormControl(gatePassRawValue.vehicleOwnerName),
      vehicleOwnerContactNumber1: new FormControl(gatePassRawValue.vehicleOwnerContactNumber1),
      vehicleOwnerContactNumber2: new FormControl(gatePassRawValue.vehicleOwnerContactNumber2),
      fuelLevel: new FormControl(gatePassRawValue.fuelLevel),
      meterReading: new FormControl(gatePassRawValue.meterReading),
      status: new FormControl(gatePassRawValue.status),
      frontView1: new FormControl(gatePassRawValue.frontView1),
      sideRView1: new FormControl(gatePassRawValue.sideRView1),
      sideLView1: new FormControl(gatePassRawValue.sideLView1),
      rearView1: new FormControl(gatePassRawValue.rearView1),
      jobCardNumber: new FormControl(gatePassRawValue.jobCardNumber),
      receiptValue: new FormControl(gatePassRawValue.receiptValue),
      entryDateTime: new FormControl(gatePassRawValue.entryDateTime),
      opsUnitID: new FormControl(gatePassRawValue.opsUnitID),
      invoiceNumber: new FormControl(gatePassRawValue.invoiceNumber),
      ownerBelongings: new FormControl(gatePassRawValue.ownerBelongings),
      createdBy: new FormControl(gatePassRawValue.createdBy),
      createdDate: new FormControl(gatePassRawValue.createdDate),
      lastModifiedBy: new FormControl(gatePassRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(gatePassRawValue.lastModifiedDate),
      jobCard: new FormControl(gatePassRawValue.jobCard),
    });
  }

  getGatePass(form: GatePassFormGroup): IGatePass | NewGatePass {
    return this.convertGatePassRawValueToGatePass(form.getRawValue() as GatePassFormRawValue | NewGatePassFormRawValue);
  }

  resetForm(form: GatePassFormGroup, gatePass: GatePassFormGroupInput): void {
    const gatePassRawValue = this.convertGatePassToGatePassRawValue({ ...this.getFormDefaults(), ...gatePass });
    form.reset(
      {
        ...gatePassRawValue,
        id: { value: gatePassRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GatePassFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      entryDateTime: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertGatePassRawValueToGatePass(rawGatePass: GatePassFormRawValue | NewGatePassFormRawValue): IGatePass | NewGatePass {
    return {
      ...rawGatePass,
      entryDateTime: dayjs(rawGatePass.entryDateTime, DATE_TIME_FORMAT),
      createdDate: dayjs(rawGatePass.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawGatePass.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertGatePassToGatePassRawValue(
    gatePass: IGatePass | (Partial<NewGatePass> & GatePassFormDefaults),
  ): GatePassFormRawValue | PartialWithRequiredKeyOf<NewGatePassFormRawValue> {
    return {
      ...gatePass,
      entryDateTime: gatePass.entryDateTime ? gatePass.entryDateTime.format(DATE_TIME_FORMAT) : undefined,
      createdDate: gatePass.createdDate ? gatePass.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: gatePass.lastModifiedDate ? gatePass.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
