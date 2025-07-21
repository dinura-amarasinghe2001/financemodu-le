import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITheInventoryBatches, NewTheInventoryBatches } from '../the-inventory-batches.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITheInventoryBatches for edit and NewTheInventoryBatchesFormGroupInput for create.
 */
type TheInventoryBatchesFormGroupInput = ITheInventoryBatches | PartialWithRequiredKeyOf<NewTheInventoryBatches>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITheInventoryBatches | NewTheInventoryBatches> = Omit<
  T,
  'txDate' | 'lmd' | 'manufactureDate' | 'expireDate' | 'addedDate'
> & {
  txDate?: string | null;
  lmd?: string | null;
  manufactureDate?: string | null;
  expireDate?: string | null;
  addedDate?: string | null;
};

type TheInventoryBatchesFormRawValue = FormValueOf<ITheInventoryBatches>;

type NewTheInventoryBatchesFormRawValue = FormValueOf<NewTheInventoryBatches>;

type TheInventoryBatchesFormDefaults = Pick<
  NewTheInventoryBatches,
  'id' | 'txDate' | 'lmd' | 'manufactureDate' | 'expireDate' | 'addedDate'
>;

type TheInventoryBatchesFormGroupContent = {
  id: FormControl<TheInventoryBatchesFormRawValue['id'] | NewTheInventoryBatches['id']>;
  itemId: FormControl<TheInventoryBatchesFormRawValue['itemId']>;
  grnId: FormControl<TheInventoryBatchesFormRawValue['grnId']>;
  code: FormControl<TheInventoryBatchesFormRawValue['code']>;
  txDate: FormControl<TheInventoryBatchesFormRawValue['txDate']>;
  cost: FormControl<TheInventoryBatchesFormRawValue['cost']>;
  price: FormControl<TheInventoryBatchesFormRawValue['price']>;
  costWithoutVat: FormControl<TheInventoryBatchesFormRawValue['costWithoutVat']>;
  priceWithoutVat: FormControl<TheInventoryBatchesFormRawValue['priceWithoutVat']>;
  notes: FormControl<TheInventoryBatchesFormRawValue['notes']>;
  lmu: FormControl<TheInventoryBatchesFormRawValue['lmu']>;
  lmd: FormControl<TheInventoryBatchesFormRawValue['lmd']>;
  lineId: FormControl<TheInventoryBatchesFormRawValue['lineId']>;
  manufactureDate: FormControl<TheInventoryBatchesFormRawValue['manufactureDate']>;
  expireDate: FormControl<TheInventoryBatchesFormRawValue['expireDate']>;
  quantity: FormControl<TheInventoryBatchesFormRawValue['quantity']>;
  addedDate: FormControl<TheInventoryBatchesFormRawValue['addedDate']>;
  costTotal: FormControl<TheInventoryBatchesFormRawValue['costTotal']>;
  returnPrice: FormControl<TheInventoryBatchesFormRawValue['returnPrice']>;
};

export type TheInventoryBatchesFormGroup = FormGroup<TheInventoryBatchesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TheInventoryBatchesFormService {
  createTheInventoryBatchesFormGroup(theInventoryBatches: TheInventoryBatchesFormGroupInput = { id: null }): TheInventoryBatchesFormGroup {
    const theInventoryBatchesRawValue = this.convertTheInventoryBatchesToTheInventoryBatchesRawValue({
      ...this.getFormDefaults(),
      ...theInventoryBatches,
    });
    return new FormGroup<TheInventoryBatchesFormGroupContent>({
      id: new FormControl(
        { value: theInventoryBatchesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      itemId: new FormControl(theInventoryBatchesRawValue.itemId),
      grnId: new FormControl(theInventoryBatchesRawValue.grnId),
      code: new FormControl(theInventoryBatchesRawValue.code),
      txDate: new FormControl(theInventoryBatchesRawValue.txDate),
      cost: new FormControl(theInventoryBatchesRawValue.cost),
      price: new FormControl(theInventoryBatchesRawValue.price),
      costWithoutVat: new FormControl(theInventoryBatchesRawValue.costWithoutVat),
      priceWithoutVat: new FormControl(theInventoryBatchesRawValue.priceWithoutVat),
      notes: new FormControl(theInventoryBatchesRawValue.notes),
      lmu: new FormControl(theInventoryBatchesRawValue.lmu),
      lmd: new FormControl(theInventoryBatchesRawValue.lmd),
      lineId: new FormControl(theInventoryBatchesRawValue.lineId),
      manufactureDate: new FormControl(theInventoryBatchesRawValue.manufactureDate),
      expireDate: new FormControl(theInventoryBatchesRawValue.expireDate),
      quantity: new FormControl(theInventoryBatchesRawValue.quantity),
      addedDate: new FormControl(theInventoryBatchesRawValue.addedDate),
      costTotal: new FormControl(theInventoryBatchesRawValue.costTotal),
      returnPrice: new FormControl(theInventoryBatchesRawValue.returnPrice),
    });
  }

  getTheInventoryBatches(form: TheInventoryBatchesFormGroup): ITheInventoryBatches | NewTheInventoryBatches {
    return this.convertTheInventoryBatchesRawValueToTheInventoryBatches(
      form.getRawValue() as TheInventoryBatchesFormRawValue | NewTheInventoryBatchesFormRawValue,
    );
  }

  resetForm(form: TheInventoryBatchesFormGroup, theInventoryBatches: TheInventoryBatchesFormGroupInput): void {
    const theInventoryBatchesRawValue = this.convertTheInventoryBatchesToTheInventoryBatchesRawValue({
      ...this.getFormDefaults(),
      ...theInventoryBatches,
    });
    form.reset(
      {
        ...theInventoryBatchesRawValue,
        id: { value: theInventoryBatchesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TheInventoryBatchesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      txDate: currentTime,
      lmd: currentTime,
      manufactureDate: currentTime,
      expireDate: currentTime,
      addedDate: currentTime,
    };
  }

  private convertTheInventoryBatchesRawValueToTheInventoryBatches(
    rawTheInventoryBatches: TheInventoryBatchesFormRawValue | NewTheInventoryBatchesFormRawValue,
  ): ITheInventoryBatches | NewTheInventoryBatches {
    return {
      ...rawTheInventoryBatches,
      txDate: dayjs(rawTheInventoryBatches.txDate, DATE_TIME_FORMAT),
      lmd: dayjs(rawTheInventoryBatches.lmd, DATE_TIME_FORMAT),
      manufactureDate: dayjs(rawTheInventoryBatches.manufactureDate, DATE_TIME_FORMAT),
      expireDate: dayjs(rawTheInventoryBatches.expireDate, DATE_TIME_FORMAT),
      addedDate: dayjs(rawTheInventoryBatches.addedDate, DATE_TIME_FORMAT),
    };
  }

  private convertTheInventoryBatchesToTheInventoryBatchesRawValue(
    theInventoryBatches: ITheInventoryBatches | (Partial<NewTheInventoryBatches> & TheInventoryBatchesFormDefaults),
  ): TheInventoryBatchesFormRawValue | PartialWithRequiredKeyOf<NewTheInventoryBatchesFormRawValue> {
    return {
      ...theInventoryBatches,
      txDate: theInventoryBatches.txDate ? theInventoryBatches.txDate.format(DATE_TIME_FORMAT) : undefined,
      lmd: theInventoryBatches.lmd ? theInventoryBatches.lmd.format(DATE_TIME_FORMAT) : undefined,
      manufactureDate: theInventoryBatches.manufactureDate ? theInventoryBatches.manufactureDate.format(DATE_TIME_FORMAT) : undefined,
      expireDate: theInventoryBatches.expireDate ? theInventoryBatches.expireDate.format(DATE_TIME_FORMAT) : undefined,
      addedDate: theInventoryBatches.addedDate ? theInventoryBatches.addedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
