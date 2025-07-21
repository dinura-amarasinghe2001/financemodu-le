import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVehicleRegistry, NewVehicleRegistry } from '../vehicle-registry.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVehicleRegistry for edit and NewVehicleRegistryFormGroupInput for create.
 */
type VehicleRegistryFormGroupInput = IVehicleRegistry | PartialWithRequiredKeyOf<NewVehicleRegistry>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVehicleRegistry | NewVehicleRegistry> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type VehicleRegistryFormRawValue = FormValueOf<IVehicleRegistry>;

type NewVehicleRegistryFormRawValue = FormValueOf<NewVehicleRegistry>;

type VehicleRegistryFormDefaults = Pick<NewVehicleRegistry, 'id' | 'createdDate' | 'lastModifiedDate'>;

type VehicleRegistryFormGroupContent = {
  id: FormControl<VehicleRegistryFormRawValue['id'] | NewVehicleRegistry['id']>;
  licenseNo: FormControl<VehicleRegistryFormRawValue['licenseNo']>;
  yom: FormControl<VehicleRegistryFormRawValue['yom']>;
  brand: FormControl<VehicleRegistryFormRawValue['brand']>;
  model: FormControl<VehicleRegistryFormRawValue['model']>;
  brandID: FormControl<VehicleRegistryFormRawValue['brandID']>;
  modelID: FormControl<VehicleRegistryFormRawValue['modelID']>;
  modelNumber: FormControl<VehicleRegistryFormRawValue['modelNumber']>;
  opsUnitID: FormControl<VehicleRegistryFormRawValue['opsUnitID']>;
  createdBy: FormControl<VehicleRegistryFormRawValue['createdBy']>;
  createdDate: FormControl<VehicleRegistryFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<VehicleRegistryFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<VehicleRegistryFormRawValue['lastModifiedDate']>;
};

export type VehicleRegistryFormGroup = FormGroup<VehicleRegistryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VehicleRegistryFormService {
  createVehicleRegistryFormGroup(vehicleRegistry: VehicleRegistryFormGroupInput = { id: null }): VehicleRegistryFormGroup {
    const vehicleRegistryRawValue = this.convertVehicleRegistryToVehicleRegistryRawValue({
      ...this.getFormDefaults(),
      ...vehicleRegistry,
    });
    return new FormGroup<VehicleRegistryFormGroupContent>({
      id: new FormControl(
        { value: vehicleRegistryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      licenseNo: new FormControl(vehicleRegistryRawValue.licenseNo),
      yom: new FormControl(vehicleRegistryRawValue.yom),
      brand: new FormControl(vehicleRegistryRawValue.brand),
      model: new FormControl(vehicleRegistryRawValue.model),
      brandID: new FormControl(vehicleRegistryRawValue.brandID),
      modelID: new FormControl(vehicleRegistryRawValue.modelID),
      modelNumber: new FormControl(vehicleRegistryRawValue.modelNumber),
      opsUnitID: new FormControl(vehicleRegistryRawValue.opsUnitID),
      createdBy: new FormControl(vehicleRegistryRawValue.createdBy),
      createdDate: new FormControl(vehicleRegistryRawValue.createdDate),
      lastModifiedBy: new FormControl(vehicleRegistryRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(vehicleRegistryRawValue.lastModifiedDate),
    });
  }

  getVehicleRegistry(form: VehicleRegistryFormGroup): IVehicleRegistry | NewVehicleRegistry {
    return this.convertVehicleRegistryRawValueToVehicleRegistry(
      form.getRawValue() as VehicleRegistryFormRawValue | NewVehicleRegistryFormRawValue,
    );
  }

  resetForm(form: VehicleRegistryFormGroup, vehicleRegistry: VehicleRegistryFormGroupInput): void {
    const vehicleRegistryRawValue = this.convertVehicleRegistryToVehicleRegistryRawValue({ ...this.getFormDefaults(), ...vehicleRegistry });
    form.reset(
      {
        ...vehicleRegistryRawValue,
        id: { value: vehicleRegistryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VehicleRegistryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertVehicleRegistryRawValueToVehicleRegistry(
    rawVehicleRegistry: VehicleRegistryFormRawValue | NewVehicleRegistryFormRawValue,
  ): IVehicleRegistry | NewVehicleRegistry {
    return {
      ...rawVehicleRegistry,
      createdDate: dayjs(rawVehicleRegistry.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawVehicleRegistry.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertVehicleRegistryToVehicleRegistryRawValue(
    vehicleRegistry: IVehicleRegistry | (Partial<NewVehicleRegistry> & VehicleRegistryFormDefaults),
  ): VehicleRegistryFormRawValue | PartialWithRequiredKeyOf<NewVehicleRegistryFormRawValue> {
    return {
      ...vehicleRegistry,
      createdDate: vehicleRegistry.createdDate ? vehicleRegistry.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: vehicleRegistry.lastModifiedDate ? vehicleRegistry.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
