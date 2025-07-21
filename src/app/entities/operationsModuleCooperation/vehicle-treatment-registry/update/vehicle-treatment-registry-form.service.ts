import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVehicleTreatmentRegistry, NewVehicleTreatmentRegistry } from '../vehicle-treatment-registry.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVehicleTreatmentRegistry for edit and NewVehicleTreatmentRegistryFormGroupInput for create.
 */
type VehicleTreatmentRegistryFormGroupInput = IVehicleTreatmentRegistry | PartialWithRequiredKeyOf<NewVehicleTreatmentRegistry>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVehicleTreatmentRegistry | NewVehicleTreatmentRegistry> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type VehicleTreatmentRegistryFormRawValue = FormValueOf<IVehicleTreatmentRegistry>;

type NewVehicleTreatmentRegistryFormRawValue = FormValueOf<NewVehicleTreatmentRegistry>;

type VehicleTreatmentRegistryFormDefaults = Pick<NewVehicleTreatmentRegistry, 'id' | 'createdDate' | 'lastModifiedDate'>;

type VehicleTreatmentRegistryFormGroupContent = {
  id: FormControl<VehicleTreatmentRegistryFormRawValue['id'] | NewVehicleTreatmentRegistry['id']>;
  fittingChargeName: FormControl<VehicleTreatmentRegistryFormRawValue['fittingChargeName']>;
  paintName: FormControl<VehicleTreatmentRegistryFormRawValue['paintName']>;
  partName: FormControl<VehicleTreatmentRegistryFormRawValue['partName']>;
  repairName: FormControl<VehicleTreatmentRegistryFormRawValue['repairName']>;
  otherName: FormControl<VehicleTreatmentRegistryFormRawValue['otherName']>;
  description: FormControl<VehicleTreatmentRegistryFormRawValue['description']>;
  partNumber: FormControl<VehicleTreatmentRegistryFormRawValue['partNumber']>;
  availableQuantity: FormControl<VehicleTreatmentRegistryFormRawValue['availableQuantity']>;
  price: FormControl<VehicleTreatmentRegistryFormRawValue['price']>;
  treatmentType: FormControl<VehicleTreatmentRegistryFormRawValue['treatmentType']>;
  opsUnitID: FormControl<VehicleTreatmentRegistryFormRawValue['opsUnitID']>;
  createdBy: FormControl<VehicleTreatmentRegistryFormRawValue['createdBy']>;
  createdDate: FormControl<VehicleTreatmentRegistryFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<VehicleTreatmentRegistryFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<VehicleTreatmentRegistryFormRawValue['lastModifiedDate']>;
  vehicleModel: FormControl<VehicleTreatmentRegistryFormRawValue['vehicleModel']>;
};

export type VehicleTreatmentRegistryFormGroup = FormGroup<VehicleTreatmentRegistryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VehicleTreatmentRegistryFormService {
  createVehicleTreatmentRegistryFormGroup(
    vehicleTreatmentRegistry: VehicleTreatmentRegistryFormGroupInput = { id: null },
  ): VehicleTreatmentRegistryFormGroup {
    const vehicleTreatmentRegistryRawValue = this.convertVehicleTreatmentRegistryToVehicleTreatmentRegistryRawValue({
      ...this.getFormDefaults(),
      ...vehicleTreatmentRegistry,
    });
    return new FormGroup<VehicleTreatmentRegistryFormGroupContent>({
      id: new FormControl(
        { value: vehicleTreatmentRegistryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fittingChargeName: new FormControl(vehicleTreatmentRegistryRawValue.fittingChargeName),
      paintName: new FormControl(vehicleTreatmentRegistryRawValue.paintName),
      partName: new FormControl(vehicleTreatmentRegistryRawValue.partName),
      repairName: new FormControl(vehicleTreatmentRegistryRawValue.repairName),
      otherName: new FormControl(vehicleTreatmentRegistryRawValue.otherName),
      description: new FormControl(vehicleTreatmentRegistryRawValue.description),
      partNumber: new FormControl(vehicleTreatmentRegistryRawValue.partNumber),
      availableQuantity: new FormControl(vehicleTreatmentRegistryRawValue.availableQuantity),
      price: new FormControl(vehicleTreatmentRegistryRawValue.price),
      treatmentType: new FormControl(vehicleTreatmentRegistryRawValue.treatmentType),
      opsUnitID: new FormControl(vehicleTreatmentRegistryRawValue.opsUnitID),
      createdBy: new FormControl(vehicleTreatmentRegistryRawValue.createdBy),
      createdDate: new FormControl(vehicleTreatmentRegistryRawValue.createdDate),
      lastModifiedBy: new FormControl(vehicleTreatmentRegistryRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(vehicleTreatmentRegistryRawValue.lastModifiedDate),
      vehicleModel: new FormControl(vehicleTreatmentRegistryRawValue.vehicleModel),
    });
  }

  getVehicleTreatmentRegistry(form: VehicleTreatmentRegistryFormGroup): IVehicleTreatmentRegistry | NewVehicleTreatmentRegistry {
    return this.convertVehicleTreatmentRegistryRawValueToVehicleTreatmentRegistry(
      form.getRawValue() as VehicleTreatmentRegistryFormRawValue | NewVehicleTreatmentRegistryFormRawValue,
    );
  }

  resetForm(form: VehicleTreatmentRegistryFormGroup, vehicleTreatmentRegistry: VehicleTreatmentRegistryFormGroupInput): void {
    const vehicleTreatmentRegistryRawValue = this.convertVehicleTreatmentRegistryToVehicleTreatmentRegistryRawValue({
      ...this.getFormDefaults(),
      ...vehicleTreatmentRegistry,
    });
    form.reset(
      {
        ...vehicleTreatmentRegistryRawValue,
        id: { value: vehicleTreatmentRegistryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VehicleTreatmentRegistryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertVehicleTreatmentRegistryRawValueToVehicleTreatmentRegistry(
    rawVehicleTreatmentRegistry: VehicleTreatmentRegistryFormRawValue | NewVehicleTreatmentRegistryFormRawValue,
  ): IVehicleTreatmentRegistry | NewVehicleTreatmentRegistry {
    return {
      ...rawVehicleTreatmentRegistry,
      createdDate: dayjs(rawVehicleTreatmentRegistry.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawVehicleTreatmentRegistry.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertVehicleTreatmentRegistryToVehicleTreatmentRegistryRawValue(
    vehicleTreatmentRegistry: IVehicleTreatmentRegistry | (Partial<NewVehicleTreatmentRegistry> & VehicleTreatmentRegistryFormDefaults),
  ): VehicleTreatmentRegistryFormRawValue | PartialWithRequiredKeyOf<NewVehicleTreatmentRegistryFormRawValue> {
    return {
      ...vehicleTreatmentRegistry,
      createdDate: vehicleTreatmentRegistry.createdDate ? vehicleTreatmentRegistry.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: vehicleTreatmentRegistry.lastModifiedDate
        ? vehicleTreatmentRegistry.lastModifiedDate.format(DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
