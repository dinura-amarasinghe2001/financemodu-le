import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITenant, NewTenant } from '../tenant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITenant for edit and NewTenantFormGroupInput for create.
 */
type TenantFormGroupInput = ITenant | PartialWithRequiredKeyOf<NewTenant>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITenant | NewTenant> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type TenantFormRawValue = FormValueOf<ITenant>;

type NewTenantFormRawValue = FormValueOf<NewTenant>;

type TenantFormDefaults = Pick<NewTenant, 'id' | 'active' | 'createdDate' | 'lastModifiedDate'>;

type TenantFormGroupContent = {
  id: FormControl<TenantFormRawValue['id'] | NewTenant['id']>;
  code: FormControl<TenantFormRawValue['code']>;
  name: FormControl<TenantFormRawValue['name']>;
  displayName: FormControl<TenantFormRawValue['displayName']>;
  tenantType: FormControl<TenantFormRawValue['tenantType']>;
  levelType: FormControl<TenantFormRawValue['levelType']>;
  levelStatus: FormControl<TenantFormRawValue['levelStatus']>;
  registrationNumber: FormControl<TenantFormRawValue['registrationNumber']>;
  taxId: FormControl<TenantFormRawValue['taxId']>;
  description: FormControl<TenantFormRawValue['description']>;
  active: FormControl<TenantFormRawValue['active']>;
  establishedDate: FormControl<TenantFormRawValue['establishedDate']>;
  website: FormControl<TenantFormRawValue['website']>;
  logo: FormControl<TenantFormRawValue['logo']>;
  createdBy: FormControl<TenantFormRawValue['createdBy']>;
  createdDate: FormControl<TenantFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<TenantFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<TenantFormRawValue['lastModifiedDate']>;
};

export type TenantFormGroup = FormGroup<TenantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TenantFormService {
  createTenantFormGroup(tenant: TenantFormGroupInput = { id: null }): TenantFormGroup {
    const tenantRawValue = this.convertTenantToTenantRawValue({
      ...this.getFormDefaults(),
      ...tenant,
    });
    return new FormGroup<TenantFormGroupContent>({
      id: new FormControl(
        { value: tenantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(tenantRawValue.code),
      name: new FormControl(tenantRawValue.name),
      displayName: new FormControl(tenantRawValue.displayName),
      tenantType: new FormControl(tenantRawValue.tenantType),
      levelType: new FormControl(tenantRawValue.levelType),
      levelStatus: new FormControl(tenantRawValue.levelStatus),
      registrationNumber: new FormControl(tenantRawValue.registrationNumber),
      taxId: new FormControl(tenantRawValue.taxId),
      description: new FormControl(tenantRawValue.description),
      active: new FormControl(tenantRawValue.active),
      establishedDate: new FormControl(tenantRawValue.establishedDate),
      website: new FormControl(tenantRawValue.website),
      logo: new FormControl(tenantRawValue.logo),
      createdBy: new FormControl(tenantRawValue.createdBy),
      createdDate: new FormControl(tenantRawValue.createdDate),
      lastModifiedBy: new FormControl(tenantRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(tenantRawValue.lastModifiedDate),
    });
  }

  getTenant(form: TenantFormGroup): ITenant | NewTenant {
    return this.convertTenantRawValueToTenant(form.getRawValue() as TenantFormRawValue | NewTenantFormRawValue);
  }

  resetForm(form: TenantFormGroup, tenant: TenantFormGroupInput): void {
    const tenantRawValue = this.convertTenantToTenantRawValue({ ...this.getFormDefaults(), ...tenant });
    form.reset(
      {
        ...tenantRawValue,
        id: { value: tenantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TenantFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      active: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertTenantRawValueToTenant(rawTenant: TenantFormRawValue | NewTenantFormRawValue): ITenant | NewTenant {
    return {
      ...rawTenant,
      createdDate: dayjs(rawTenant.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawTenant.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertTenantToTenantRawValue(
    tenant: ITenant | (Partial<NewTenant> & TenantFormDefaults),
  ): TenantFormRawValue | PartialWithRequiredKeyOf<NewTenantFormRawValue> {
    return {
      ...tenant,
      createdDate: tenant.createdDate ? tenant.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: tenant.lastModifiedDate ? tenant.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
