import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInventoryBatches, NewInventoryBatches } from '../inventory-batches.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInventoryBatches for edit and NewInventoryBatchesFormGroupInput for create.
 */
type InventoryBatchesFormGroupInput = IInventoryBatches | PartialWithRequiredKeyOf<NewInventoryBatches>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInventoryBatches | NewInventoryBatches> = Omit<
  T,
  'txDate' | 'lmd' | 'manufactureDate' | 'expireDate' | 'addedDate'
> & {
  txDate?: string | null;
  lmd?: string | null;
  manufactureDate?: string | null;
  expireDate?: string | null;
  addedDate?: string | null;
};

type InventoryBatchesFormRawValue = FormValueOf<IInventoryBatches>;

type NewInventoryBatchesFormRawValue = FormValueOf<NewInventoryBatches>;

type InventoryBatchesFormDefaults = Pick<NewInventoryBatches, 'id' | 'txDate' | 'lmd' | 'manufactureDate' | 'expireDate' | 'addedDate'>;

type InventoryBatchesFormGroupContent = {
  id: FormControl<InventoryBatchesFormRawValue['id'] | NewInventoryBatches['id']>;
  itemId: FormControl<InventoryBatchesFormRawValue['itemId']>;
  code: FormControl<InventoryBatchesFormRawValue['code']>;
  txDate: FormControl<InventoryBatchesFormRawValue['txDate']>;
  cost: FormControl<InventoryBatchesFormRawValue['cost']>;
  price: FormControl<InventoryBatchesFormRawValue['price']>;
  costWithoutVat: FormControl<InventoryBatchesFormRawValue['costWithoutVat']>;
  priceWithoutVat: FormControl<InventoryBatchesFormRawValue['priceWithoutVat']>;
  notes: FormControl<InventoryBatchesFormRawValue['notes']>;
  lmu: FormControl<InventoryBatchesFormRawValue['lmu']>;
  lmd: FormControl<InventoryBatchesFormRawValue['lmd']>;
  lineId: FormControl<InventoryBatchesFormRawValue['lineId']>;
  manufactureDate: FormControl<InventoryBatchesFormRawValue['manufactureDate']>;
  expireDate: FormControl<InventoryBatchesFormRawValue['expireDate']>;
  quantity: FormControl<InventoryBatchesFormRawValue['quantity']>;
  addedDate: FormControl<InventoryBatchesFormRawValue['addedDate']>;
  costTotal: FormControl<InventoryBatchesFormRawValue['costTotal']>;
  returnPrice: FormControl<InventoryBatchesFormRawValue['returnPrice']>;
};

export type InventoryBatchesFormGroup = FormGroup<InventoryBatchesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InventoryBatchesFormService {
  createInventoryBatchesFormGroup(inventoryBatches: InventoryBatchesFormGroupInput = { id: null }): InventoryBatchesFormGroup {
    const inventoryBatchesRawValue = this.convertInventoryBatchesToInventoryBatchesRawValue({
      ...this.getFormDefaults(),
      ...inventoryBatches,
    });
    return new FormGroup<InventoryBatchesFormGroupContent>({
      id: new FormControl(
        { value: inventoryBatchesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      itemId: new FormControl(inventoryBatchesRawValue.itemId),
      code: new FormControl(inventoryBatchesRawValue.code),
      txDate: new FormControl(inventoryBatchesRawValue.txDate),
      cost: new FormControl(inventoryBatchesRawValue.cost),
      price: new FormControl(inventoryBatchesRawValue.price),
      costWithoutVat: new FormControl(inventoryBatchesRawValue.costWithoutVat),
      priceWithoutVat: new FormControl(inventoryBatchesRawValue.priceWithoutVat),
      notes: new FormControl(inventoryBatchesRawValue.notes),
      lmu: new FormControl(inventoryBatchesRawValue.lmu),
      lmd: new FormControl(inventoryBatchesRawValue.lmd),
      lineId: new FormControl(inventoryBatchesRawValue.lineId),
      manufactureDate: new FormControl(inventoryBatchesRawValue.manufactureDate),
      expireDate: new FormControl(inventoryBatchesRawValue.expireDate),
      quantity: new FormControl(inventoryBatchesRawValue.quantity),
      addedDate: new FormControl(inventoryBatchesRawValue.addedDate),
      costTotal: new FormControl(inventoryBatchesRawValue.costTotal),
      returnPrice: new FormControl(inventoryBatchesRawValue.returnPrice),
    });
  }

  getInventoryBatches(form: InventoryBatchesFormGroup): IInventoryBatches | NewInventoryBatches {
    return this.convertInventoryBatchesRawValueToInventoryBatches(
      form.getRawValue() as InventoryBatchesFormRawValue | NewInventoryBatchesFormRawValue,
    );
  }

  resetForm(form: InventoryBatchesFormGroup, inventoryBatches: InventoryBatchesFormGroupInput): void {
    const inventoryBatchesRawValue = this.convertInventoryBatchesToInventoryBatchesRawValue({
      ...this.getFormDefaults(),
      ...inventoryBatches,
    });
    form.reset(
      {
        ...inventoryBatchesRawValue,
        id: { value: inventoryBatchesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InventoryBatchesFormDefaults {
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

  private convertInventoryBatchesRawValueToInventoryBatches(
    rawInventoryBatches: InventoryBatchesFormRawValue | NewInventoryBatchesFormRawValue,
  ): IInventoryBatches | NewInventoryBatches {
    return {
      ...rawInventoryBatches,
      txDate: dayjs(rawInventoryBatches.txDate, DATE_TIME_FORMAT),
      lmd: dayjs(rawInventoryBatches.lmd, DATE_TIME_FORMAT),
      manufactureDate: dayjs(rawInventoryBatches.manufactureDate, DATE_TIME_FORMAT),
      expireDate: dayjs(rawInventoryBatches.expireDate, DATE_TIME_FORMAT),
      addedDate: dayjs(rawInventoryBatches.addedDate, DATE_TIME_FORMAT),
    };
  }

  private convertInventoryBatchesToInventoryBatchesRawValue(
    inventoryBatches: IInventoryBatches | (Partial<NewInventoryBatches> & InventoryBatchesFormDefaults),
  ): InventoryBatchesFormRawValue | PartialWithRequiredKeyOf<NewInventoryBatchesFormRawValue> {
    return {
      ...inventoryBatches,
      txDate: inventoryBatches.txDate ? inventoryBatches.txDate.format(DATE_TIME_FORMAT) : undefined,
      lmd: inventoryBatches.lmd ? inventoryBatches.lmd.format(DATE_TIME_FORMAT) : undefined,
      manufactureDate: inventoryBatches.manufactureDate ? inventoryBatches.manufactureDate.format(DATE_TIME_FORMAT) : undefined,
      expireDate: inventoryBatches.expireDate ? inventoryBatches.expireDate.format(DATE_TIME_FORMAT) : undefined,
      addedDate: inventoryBatches.addedDate ? inventoryBatches.addedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
