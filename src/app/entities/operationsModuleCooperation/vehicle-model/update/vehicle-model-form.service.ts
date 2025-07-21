import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVehicleModel, NewVehicleModel } from '../vehicle-model.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVehicleModel for edit and NewVehicleModelFormGroupInput for create.
 */
type VehicleModelFormGroupInput = IVehicleModel | PartialWithRequiredKeyOf<NewVehicleModel>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVehicleModel | NewVehicleModel> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type VehicleModelFormRawValue = FormValueOf<IVehicleModel>;

type NewVehicleModelFormRawValue = FormValueOf<NewVehicleModel>;

type VehicleModelFormDefaults = Pick<NewVehicleModel, 'id' | 'createdDate' | 'lastModifiedDate'>;

type VehicleModelFormGroupContent = {
  id: FormControl<VehicleModelFormRawValue['id'] | NewVehicleModel['id']>;
  modelName: FormControl<VehicleModelFormRawValue['modelName']>;
  description: FormControl<VehicleModelFormRawValue['description']>;
  opsUnitID: FormControl<VehicleModelFormRawValue['opsUnitID']>;
  createdBy: FormControl<VehicleModelFormRawValue['createdBy']>;
  createdDate: FormControl<VehicleModelFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<VehicleModelFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<VehicleModelFormRawValue['lastModifiedDate']>;
  brand: FormControl<VehicleModelFormRawValue['brand']>;
};

export type VehicleModelFormGroup = FormGroup<VehicleModelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VehicleModelFormService {
  createVehicleModelFormGroup(vehicleModel: VehicleModelFormGroupInput = { id: null }): VehicleModelFormGroup {
    const vehicleModelRawValue = this.convertVehicleModelToVehicleModelRawValue({
      ...this.getFormDefaults(),
      ...vehicleModel,
    });
    return new FormGroup<VehicleModelFormGroupContent>({
      id: new FormControl(
        { value: vehicleModelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      modelName: new FormControl(vehicleModelRawValue.modelName),
      description: new FormControl(vehicleModelRawValue.description),
      opsUnitID: new FormControl(vehicleModelRawValue.opsUnitID),
      createdBy: new FormControl(vehicleModelRawValue.createdBy),
      createdDate: new FormControl(vehicleModelRawValue.createdDate),
      lastModifiedBy: new FormControl(vehicleModelRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(vehicleModelRawValue.lastModifiedDate),
      brand: new FormControl(vehicleModelRawValue.brand),
    });
  }

  getVehicleModel(form: VehicleModelFormGroup): IVehicleModel | NewVehicleModel {
    return this.convertVehicleModelRawValueToVehicleModel(form.getRawValue() as VehicleModelFormRawValue | NewVehicleModelFormRawValue);
  }

  resetForm(form: VehicleModelFormGroup, vehicleModel: VehicleModelFormGroupInput): void {
    const vehicleModelRawValue = this.convertVehicleModelToVehicleModelRawValue({ ...this.getFormDefaults(), ...vehicleModel });
    form.reset(
      {
        ...vehicleModelRawValue,
        id: { value: vehicleModelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VehicleModelFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertVehicleModelRawValueToVehicleModel(
    rawVehicleModel: VehicleModelFormRawValue | NewVehicleModelFormRawValue,
  ): IVehicleModel | NewVehicleModel {
    return {
      ...rawVehicleModel,
      createdDate: dayjs(rawVehicleModel.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawVehicleModel.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertVehicleModelToVehicleModelRawValue(
    vehicleModel: IVehicleModel | (Partial<NewVehicleModel> & VehicleModelFormDefaults),
  ): VehicleModelFormRawValue | PartialWithRequiredKeyOf<NewVehicleModelFormRawValue> {
    return {
      ...vehicleModel,
      createdDate: vehicleModel.createdDate ? vehicleModel.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: vehicleModel.lastModifiedDate ? vehicleModel.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
