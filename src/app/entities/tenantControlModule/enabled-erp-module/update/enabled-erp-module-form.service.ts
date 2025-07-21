import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEnabledERPModule, NewEnabledERPModule } from '../enabled-erp-module.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEnabledERPModule for edit and NewEnabledERPModuleFormGroupInput for create.
 */
type EnabledERPModuleFormGroupInput = IEnabledERPModule | PartialWithRequiredKeyOf<NewEnabledERPModule>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEnabledERPModule | NewEnabledERPModule> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type EnabledERPModuleFormRawValue = FormValueOf<IEnabledERPModule>;

type NewEnabledERPModuleFormRawValue = FormValueOf<NewEnabledERPModule>;

type EnabledERPModuleFormDefaults = Pick<NewEnabledERPModule, 'id' | 'createdDate' | 'lastModifiedDate'>;

type EnabledERPModuleFormGroupContent = {
  id: FormControl<EnabledERPModuleFormRawValue['id'] | NewEnabledERPModule['id']>;
  moduleName: FormControl<EnabledERPModuleFormRawValue['moduleName']>;
  moduleCode: FormControl<EnabledERPModuleFormRawValue['moduleCode']>;
  description: FormControl<EnabledERPModuleFormRawValue['description']>;
  createdBy: FormControl<EnabledERPModuleFormRawValue['createdBy']>;
  createdDate: FormControl<EnabledERPModuleFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<EnabledERPModuleFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<EnabledERPModuleFormRawValue['lastModifiedDate']>;
  operationalUnit: FormControl<EnabledERPModuleFormRawValue['operationalUnit']>;
};

export type EnabledERPModuleFormGroup = FormGroup<EnabledERPModuleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EnabledERPModuleFormService {
  createEnabledERPModuleFormGroup(enabledERPModule: EnabledERPModuleFormGroupInput = { id: null }): EnabledERPModuleFormGroup {
    const enabledERPModuleRawValue = this.convertEnabledERPModuleToEnabledERPModuleRawValue({
      ...this.getFormDefaults(),
      ...enabledERPModule,
    });
    return new FormGroup<EnabledERPModuleFormGroupContent>({
      id: new FormControl(
        { value: enabledERPModuleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      moduleName: new FormControl(enabledERPModuleRawValue.moduleName),
      moduleCode: new FormControl(enabledERPModuleRawValue.moduleCode),
      description: new FormControl(enabledERPModuleRawValue.description),
      createdBy: new FormControl(enabledERPModuleRawValue.createdBy),
      createdDate: new FormControl(enabledERPModuleRawValue.createdDate),
      lastModifiedBy: new FormControl(enabledERPModuleRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(enabledERPModuleRawValue.lastModifiedDate),
      operationalUnit: new FormControl(enabledERPModuleRawValue.operationalUnit),
    });
  }

  getEnabledERPModule(form: EnabledERPModuleFormGroup): IEnabledERPModule | NewEnabledERPModule {
    return this.convertEnabledERPModuleRawValueToEnabledERPModule(
      form.getRawValue() as EnabledERPModuleFormRawValue | NewEnabledERPModuleFormRawValue,
    );
  }

  resetForm(form: EnabledERPModuleFormGroup, enabledERPModule: EnabledERPModuleFormGroupInput): void {
    const enabledERPModuleRawValue = this.convertEnabledERPModuleToEnabledERPModuleRawValue({
      ...this.getFormDefaults(),
      ...enabledERPModule,
    });
    form.reset(
      {
        ...enabledERPModuleRawValue,
        id: { value: enabledERPModuleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EnabledERPModuleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEnabledERPModuleRawValueToEnabledERPModule(
    rawEnabledERPModule: EnabledERPModuleFormRawValue | NewEnabledERPModuleFormRawValue,
  ): IEnabledERPModule | NewEnabledERPModule {
    return {
      ...rawEnabledERPModule,
      createdDate: dayjs(rawEnabledERPModule.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEnabledERPModule.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEnabledERPModuleToEnabledERPModuleRawValue(
    enabledERPModule: IEnabledERPModule | (Partial<NewEnabledERPModule> & EnabledERPModuleFormDefaults),
  ): EnabledERPModuleFormRawValue | PartialWithRequiredKeyOf<NewEnabledERPModuleFormRawValue> {
    return {
      ...enabledERPModule,
      createdDate: enabledERPModule.createdDate ? enabledERPModule.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: enabledERPModule.lastModifiedDate ? enabledERPModule.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
