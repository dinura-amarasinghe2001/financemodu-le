import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOperationalUnit, NewOperationalUnit } from '../operational-unit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOperationalUnit for edit and NewOperationalUnitFormGroupInput for create.
 */
type OperationalUnitFormGroupInput = IOperationalUnit | PartialWithRequiredKeyOf<NewOperationalUnit>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOperationalUnit | NewOperationalUnit> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type OperationalUnitFormRawValue = FormValueOf<IOperationalUnit>;

type NewOperationalUnitFormRawValue = FormValueOf<NewOperationalUnit>;

type OperationalUnitFormDefaults = Pick<NewOperationalUnit, 'id' | 'createdDate' | 'lastModifiedDate'>;

type OperationalUnitFormGroupContent = {
  id: FormControl<OperationalUnitFormRawValue['id'] | NewOperationalUnit['id']>;
  code: FormControl<OperationalUnitFormRawValue['code']>;
  name: FormControl<OperationalUnitFormRawValue['name']>;
  displayName: FormControl<OperationalUnitFormRawValue['displayName']>;
  levelBusinessType: FormControl<OperationalUnitFormRawValue['levelBusinessType']>;
  remark: FormControl<OperationalUnitFormRawValue['remark']>;
  description: FormControl<OperationalUnitFormRawValue['description']>;
  contactEmail: FormControl<OperationalUnitFormRawValue['contactEmail']>;
  contactPhone: FormControl<OperationalUnitFormRawValue['contactPhone']>;
  immediateParentCode: FormControl<OperationalUnitFormRawValue['immediateParentCode']>;
  levelType: FormControl<OperationalUnitFormRawValue['levelType']>;
  createdBy: FormControl<OperationalUnitFormRawValue['createdBy']>;
  createdDate: FormControl<OperationalUnitFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<OperationalUnitFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<OperationalUnitFormRawValue['lastModifiedDate']>;
  tenant: FormControl<OperationalUnitFormRawValue['tenant']>;
};

export type OperationalUnitFormGroup = FormGroup<OperationalUnitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OperationalUnitFormService {
  createOperationalUnitFormGroup(operationalUnit: OperationalUnitFormGroupInput = { id: null }): OperationalUnitFormGroup {
    const operationalUnitRawValue = this.convertOperationalUnitToOperationalUnitRawValue({
      ...this.getFormDefaults(),
      ...operationalUnit,
    });
    return new FormGroup<OperationalUnitFormGroupContent>({
      id: new FormControl(
        { value: operationalUnitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(operationalUnitRawValue.code),
      name: new FormControl(operationalUnitRawValue.name),
      displayName: new FormControl(operationalUnitRawValue.displayName),
      levelBusinessType: new FormControl(operationalUnitRawValue.levelBusinessType),
      remark: new FormControl(operationalUnitRawValue.remark),
      description: new FormControl(operationalUnitRawValue.description),
      contactEmail: new FormControl(operationalUnitRawValue.contactEmail),
      contactPhone: new FormControl(operationalUnitRawValue.contactPhone),
      immediateParentCode: new FormControl(operationalUnitRawValue.immediateParentCode),
      levelType: new FormControl(operationalUnitRawValue.levelType),
      createdBy: new FormControl(operationalUnitRawValue.createdBy),
      createdDate: new FormControl(operationalUnitRawValue.createdDate),
      lastModifiedBy: new FormControl(operationalUnitRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(operationalUnitRawValue.lastModifiedDate),
      tenant: new FormControl(operationalUnitRawValue.tenant),
    });
  }

  getOperationalUnit(form: OperationalUnitFormGroup): IOperationalUnit | NewOperationalUnit {
    return this.convertOperationalUnitRawValueToOperationalUnit(
      form.getRawValue() as OperationalUnitFormRawValue | NewOperationalUnitFormRawValue,
    );
  }

  resetForm(form: OperationalUnitFormGroup, operationalUnit: OperationalUnitFormGroupInput): void {
    const operationalUnitRawValue = this.convertOperationalUnitToOperationalUnitRawValue({ ...this.getFormDefaults(), ...operationalUnit });
    form.reset(
      {
        ...operationalUnitRawValue,
        id: { value: operationalUnitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OperationalUnitFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertOperationalUnitRawValueToOperationalUnit(
    rawOperationalUnit: OperationalUnitFormRawValue | NewOperationalUnitFormRawValue,
  ): IOperationalUnit | NewOperationalUnit {
    return {
      ...rawOperationalUnit,
      createdDate: dayjs(rawOperationalUnit.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawOperationalUnit.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertOperationalUnitToOperationalUnitRawValue(
    operationalUnit: IOperationalUnit | (Partial<NewOperationalUnit> & OperationalUnitFormDefaults),
  ): OperationalUnitFormRawValue | PartialWithRequiredKeyOf<NewOperationalUnitFormRawValue> {
    return {
      ...operationalUnit,
      createdDate: operationalUnit.createdDate ? operationalUnit.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: operationalUnit.lastModifiedDate ? operationalUnit.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
