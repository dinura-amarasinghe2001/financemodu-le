import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFlag, NewFlag } from '../flag.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFlag for edit and NewFlagFormGroupInput for create.
 */
type FlagFormGroupInput = IFlag | PartialWithRequiredKeyOf<NewFlag>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFlag | NewFlag> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type FlagFormRawValue = FormValueOf<IFlag>;

type NewFlagFormRawValue = FormValueOf<NewFlag>;

type FlagFormDefaults = Pick<NewFlag, 'id' | 'flagValue' | 'isDeleted' | 'createdDate' | 'lastModifiedDate'>;

type FlagFormGroupContent = {
  id: FormControl<FlagFormRawValue['id'] | NewFlag['id']>;
  code: FormControl<FlagFormRawValue['code']>;
  flagId: FormControl<FlagFormRawValue['flagId']>;
  flagName: FormControl<FlagFormRawValue['flagName']>;
  flagValue: FormControl<FlagFormRawValue['flagValue']>;
  description: FormControl<FlagFormRawValue['description']>;
  isDeleted: FormControl<FlagFormRawValue['isDeleted']>;
  createdBy: FormControl<FlagFormRawValue['createdBy']>;
  createdDate: FormControl<FlagFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<FlagFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<FlagFormRawValue['lastModifiedDate']>;
  tenant: FormControl<FlagFormRawValue['tenant']>;
};

export type FlagFormGroup = FormGroup<FlagFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FlagFormService {
  createFlagFormGroup(flag: FlagFormGroupInput = { id: null }): FlagFormGroup {
    const flagRawValue = this.convertFlagToFlagRawValue({
      ...this.getFormDefaults(),
      ...flag,
    });
    return new FormGroup<FlagFormGroupContent>({
      id: new FormControl(
        { value: flagRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(flagRawValue.code),
      flagId: new FormControl(flagRawValue.flagId),
      flagName: new FormControl(flagRawValue.flagName),
      flagValue: new FormControl(flagRawValue.flagValue),
      description: new FormControl(flagRawValue.description),
      isDeleted: new FormControl(flagRawValue.isDeleted),
      createdBy: new FormControl(flagRawValue.createdBy),
      createdDate: new FormControl(flagRawValue.createdDate),
      lastModifiedBy: new FormControl(flagRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(flagRawValue.lastModifiedDate),
      tenant: new FormControl(flagRawValue.tenant),
    });
  }

  getFlag(form: FlagFormGroup): IFlag | NewFlag {
    return this.convertFlagRawValueToFlag(form.getRawValue() as FlagFormRawValue | NewFlagFormRawValue);
  }

  resetForm(form: FlagFormGroup, flag: FlagFormGroupInput): void {
    const flagRawValue = this.convertFlagToFlagRawValue({ ...this.getFormDefaults(), ...flag });
    form.reset(
      {
        ...flagRawValue,
        id: { value: flagRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FlagFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      flagValue: false,
      isDeleted: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertFlagRawValueToFlag(rawFlag: FlagFormRawValue | NewFlagFormRawValue): IFlag | NewFlag {
    return {
      ...rawFlag,
      createdDate: dayjs(rawFlag.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawFlag.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertFlagToFlagRawValue(
    flag: IFlag | (Partial<NewFlag> & FlagFormDefaults),
  ): FlagFormRawValue | PartialWithRequiredKeyOf<NewFlagFormRawValue> {
    return {
      ...flag,
      createdDate: flag.createdDate ? flag.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: flag.lastModifiedDate ? flag.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
