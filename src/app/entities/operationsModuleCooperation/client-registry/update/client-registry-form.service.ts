import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IClientRegistry, NewClientRegistry } from '../client-registry.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClientRegistry for edit and NewClientRegistryFormGroupInput for create.
 */
type ClientRegistryFormGroupInput = IClientRegistry | PartialWithRequiredKeyOf<NewClientRegistry>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IClientRegistry | NewClientRegistry> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ClientRegistryFormRawValue = FormValueOf<IClientRegistry>;

type NewClientRegistryFormRawValue = FormValueOf<NewClientRegistry>;

type ClientRegistryFormDefaults = Pick<NewClientRegistry, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ClientRegistryFormGroupContent = {
  id: FormControl<ClientRegistryFormRawValue['id'] | NewClientRegistry['id']>;
  name: FormControl<ClientRegistryFormRawValue['name']>;
  lastVehicleID: FormControl<ClientRegistryFormRawValue['lastVehicleID']>;
  lastReceiptID: FormControl<ClientRegistryFormRawValue['lastReceiptID']>;
  address: FormControl<ClientRegistryFormRawValue['address']>;
  city: FormControl<ClientRegistryFormRawValue['city']>;
  contactNumber1: FormControl<ClientRegistryFormRawValue['contactNumber1']>;
  contactNumber2: FormControl<ClientRegistryFormRawValue['contactNumber2']>;
  email: FormControl<ClientRegistryFormRawValue['email']>;
  opsUnitID: FormControl<ClientRegistryFormRawValue['opsUnitID']>;
  createdBy: FormControl<ClientRegistryFormRawValue['createdBy']>;
  createdDate: FormControl<ClientRegistryFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ClientRegistryFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ClientRegistryFormRawValue['lastModifiedDate']>;
};

export type ClientRegistryFormGroup = FormGroup<ClientRegistryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientRegistryFormService {
  createClientRegistryFormGroup(clientRegistry: ClientRegistryFormGroupInput = { id: null }): ClientRegistryFormGroup {
    const clientRegistryRawValue = this.convertClientRegistryToClientRegistryRawValue({
      ...this.getFormDefaults(),
      ...clientRegistry,
    });
    return new FormGroup<ClientRegistryFormGroupContent>({
      id: new FormControl(
        { value: clientRegistryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(clientRegistryRawValue.name),
      lastVehicleID: new FormControl(clientRegistryRawValue.lastVehicleID),
      lastReceiptID: new FormControl(clientRegistryRawValue.lastReceiptID),
      address: new FormControl(clientRegistryRawValue.address),
      city: new FormControl(clientRegistryRawValue.city),
      contactNumber1: new FormControl(clientRegistryRawValue.contactNumber1),
      contactNumber2: new FormControl(clientRegistryRawValue.contactNumber2),
      email: new FormControl(clientRegistryRawValue.email),
      opsUnitID: new FormControl(clientRegistryRawValue.opsUnitID),
      createdBy: new FormControl(clientRegistryRawValue.createdBy),
      createdDate: new FormControl(clientRegistryRawValue.createdDate),
      lastModifiedBy: new FormControl(clientRegistryRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(clientRegistryRawValue.lastModifiedDate),
    });
  }

  getClientRegistry(form: ClientRegistryFormGroup): IClientRegistry | NewClientRegistry {
    return this.convertClientRegistryRawValueToClientRegistry(
      form.getRawValue() as ClientRegistryFormRawValue | NewClientRegistryFormRawValue,
    );
  }

  resetForm(form: ClientRegistryFormGroup, clientRegistry: ClientRegistryFormGroupInput): void {
    const clientRegistryRawValue = this.convertClientRegistryToClientRegistryRawValue({ ...this.getFormDefaults(), ...clientRegistry });
    form.reset(
      {
        ...clientRegistryRawValue,
        id: { value: clientRegistryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClientRegistryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertClientRegistryRawValueToClientRegistry(
    rawClientRegistry: ClientRegistryFormRawValue | NewClientRegistryFormRawValue,
  ): IClientRegistry | NewClientRegistry {
    return {
      ...rawClientRegistry,
      createdDate: dayjs(rawClientRegistry.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawClientRegistry.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertClientRegistryToClientRegistryRawValue(
    clientRegistry: IClientRegistry | (Partial<NewClientRegistry> & ClientRegistryFormDefaults),
  ): ClientRegistryFormRawValue | PartialWithRequiredKeyOf<NewClientRegistryFormRawValue> {
    return {
      ...clientRegistry,
      createdDate: clientRegistry.createdDate ? clientRegistry.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: clientRegistry.lastModifiedDate ? clientRegistry.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
