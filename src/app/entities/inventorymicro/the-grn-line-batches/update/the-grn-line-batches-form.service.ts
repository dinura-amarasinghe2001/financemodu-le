import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITheGRNLineBatches, NewTheGRNLineBatches } from '../the-grn-line-batches.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITheGRNLineBatches for edit and NewTheGRNLineBatchesFormGroupInput for create.
 */
type TheGRNLineBatchesFormGroupInput = ITheGRNLineBatches | PartialWithRequiredKeyOf<NewTheGRNLineBatches>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITheGRNLineBatches | NewTheGRNLineBatches> = Omit<T, 'txDate' | 'manufactureDate' | 'expiredDate' | 'lmd'> & {
  txDate?: string | null;
  manufactureDate?: string | null;
  expiredDate?: string | null;
  lmd?: string | null;
};

type TheGRNLineBatchesFormRawValue = FormValueOf<ITheGRNLineBatches>;

type NewTheGRNLineBatchesFormRawValue = FormValueOf<NewTheGRNLineBatches>;

type TheGRNLineBatchesFormDefaults = Pick<
  NewTheGRNLineBatches,
  'id' | 'txDate' | 'manufactureDate' | 'expiredDate' | 'hasVat' | 'lmd' | 'inspected' | 'isInventoryUpdate'
>;

type TheGRNLineBatchesFormGroupContent = {
  id: FormControl<TheGRNLineBatchesFormRawValue['id'] | NewTheGRNLineBatches['id']>;
  grnId: FormControl<TheGRNLineBatchesFormRawValue['grnId']>;
  lineId: FormControl<TheGRNLineBatchesFormRawValue['lineId']>;
  batchLineId: FormControl<TheGRNLineBatchesFormRawValue['batchLineId']>;
  itemId: FormControl<TheGRNLineBatchesFormRawValue['itemId']>;
  code: FormControl<TheGRNLineBatchesFormRawValue['code']>;
  txDate: FormControl<TheGRNLineBatchesFormRawValue['txDate']>;
  manufactureDate: FormControl<TheGRNLineBatchesFormRawValue['manufactureDate']>;
  expiredDate: FormControl<TheGRNLineBatchesFormRawValue['expiredDate']>;
  qty: FormControl<TheGRNLineBatchesFormRawValue['qty']>;
  cost: FormControl<TheGRNLineBatchesFormRawValue['cost']>;
  price: FormControl<TheGRNLineBatchesFormRawValue['price']>;
  costWithoutVat: FormControl<TheGRNLineBatchesFormRawValue['costWithoutVat']>;
  priceWithoutVat: FormControl<TheGRNLineBatchesFormRawValue['priceWithoutVat']>;
  hasVat: FormControl<TheGRNLineBatchesFormRawValue['hasVat']>;
  supplierDiscount: FormControl<TheGRNLineBatchesFormRawValue['supplierDiscount']>;
  notes: FormControl<TheGRNLineBatchesFormRawValue['notes']>;
  lmu: FormControl<TheGRNLineBatchesFormRawValue['lmu']>;
  lmd: FormControl<TheGRNLineBatchesFormRawValue['lmd']>;
  batchId: FormControl<TheGRNLineBatchesFormRawValue['batchId']>;
  qtyIn: FormControl<TheGRNLineBatchesFormRawValue['qtyIn']>;
  qtyOut: FormControl<TheGRNLineBatchesFormRawValue['qtyOut']>;
  batchLineTotal: FormControl<TheGRNLineBatchesFormRawValue['batchLineTotal']>;
  inspected: FormControl<TheGRNLineBatchesFormRawValue['inspected']>;
  passQty: FormControl<TheGRNLineBatchesFormRawValue['passQty']>;
  currentReceivedQty: FormControl<TheGRNLineBatchesFormRawValue['currentReceivedQty']>;
  totalPassedQty: FormControl<TheGRNLineBatchesFormRawValue['totalPassedQty']>;
  isInventoryUpdate: FormControl<TheGRNLineBatchesFormRawValue['isInventoryUpdate']>;
  inventoryQty: FormControl<TheGRNLineBatchesFormRawValue['inventoryQty']>;
  totalInventoryQty: FormControl<TheGRNLineBatchesFormRawValue['totalInventoryQty']>;
  returnPrice: FormControl<TheGRNLineBatchesFormRawValue['returnPrice']>;
};

export type TheGRNLineBatchesFormGroup = FormGroup<TheGRNLineBatchesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TheGRNLineBatchesFormService {
  createTheGRNLineBatchesFormGroup(theGRNLineBatches: TheGRNLineBatchesFormGroupInput = { id: null }): TheGRNLineBatchesFormGroup {
    const theGRNLineBatchesRawValue = this.convertTheGRNLineBatchesToTheGRNLineBatchesRawValue({
      ...this.getFormDefaults(),
      ...theGRNLineBatches,
    });
    return new FormGroup<TheGRNLineBatchesFormGroupContent>({
      id: new FormControl(
        { value: theGRNLineBatchesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      grnId: new FormControl(theGRNLineBatchesRawValue.grnId),
      lineId: new FormControl(theGRNLineBatchesRawValue.lineId),
      batchLineId: new FormControl(theGRNLineBatchesRawValue.batchLineId),
      itemId: new FormControl(theGRNLineBatchesRawValue.itemId),
      code: new FormControl(theGRNLineBatchesRawValue.code),
      txDate: new FormControl(theGRNLineBatchesRawValue.txDate),
      manufactureDate: new FormControl(theGRNLineBatchesRawValue.manufactureDate),
      expiredDate: new FormControl(theGRNLineBatchesRawValue.expiredDate),
      qty: new FormControl(theGRNLineBatchesRawValue.qty),
      cost: new FormControl(theGRNLineBatchesRawValue.cost),
      price: new FormControl(theGRNLineBatchesRawValue.price),
      costWithoutVat: new FormControl(theGRNLineBatchesRawValue.costWithoutVat),
      priceWithoutVat: new FormControl(theGRNLineBatchesRawValue.priceWithoutVat),
      hasVat: new FormControl(theGRNLineBatchesRawValue.hasVat),
      supplierDiscount: new FormControl(theGRNLineBatchesRawValue.supplierDiscount),
      notes: new FormControl(theGRNLineBatchesRawValue.notes),
      lmu: new FormControl(theGRNLineBatchesRawValue.lmu),
      lmd: new FormControl(theGRNLineBatchesRawValue.lmd),
      batchId: new FormControl(theGRNLineBatchesRawValue.batchId),
      qtyIn: new FormControl(theGRNLineBatchesRawValue.qtyIn),
      qtyOut: new FormControl(theGRNLineBatchesRawValue.qtyOut),
      batchLineTotal: new FormControl(theGRNLineBatchesRawValue.batchLineTotal),
      inspected: new FormControl(theGRNLineBatchesRawValue.inspected),
      passQty: new FormControl(theGRNLineBatchesRawValue.passQty),
      currentReceivedQty: new FormControl(theGRNLineBatchesRawValue.currentReceivedQty),
      totalPassedQty: new FormControl(theGRNLineBatchesRawValue.totalPassedQty),
      isInventoryUpdate: new FormControl(theGRNLineBatchesRawValue.isInventoryUpdate),
      inventoryQty: new FormControl(theGRNLineBatchesRawValue.inventoryQty),
      totalInventoryQty: new FormControl(theGRNLineBatchesRawValue.totalInventoryQty),
      returnPrice: new FormControl(theGRNLineBatchesRawValue.returnPrice),
    });
  }

  getTheGRNLineBatches(form: TheGRNLineBatchesFormGroup): ITheGRNLineBatches | NewTheGRNLineBatches {
    return this.convertTheGRNLineBatchesRawValueToTheGRNLineBatches(
      form.getRawValue() as TheGRNLineBatchesFormRawValue | NewTheGRNLineBatchesFormRawValue,
    );
  }

  resetForm(form: TheGRNLineBatchesFormGroup, theGRNLineBatches: TheGRNLineBatchesFormGroupInput): void {
    const theGRNLineBatchesRawValue = this.convertTheGRNLineBatchesToTheGRNLineBatchesRawValue({
      ...this.getFormDefaults(),
      ...theGRNLineBatches,
    });
    form.reset(
      {
        ...theGRNLineBatchesRawValue,
        id: { value: theGRNLineBatchesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TheGRNLineBatchesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      txDate: currentTime,
      manufactureDate: currentTime,
      expiredDate: currentTime,
      hasVat: false,
      lmd: currentTime,
      inspected: false,
      isInventoryUpdate: false,
    };
  }

  private convertTheGRNLineBatchesRawValueToTheGRNLineBatches(
    rawTheGRNLineBatches: TheGRNLineBatchesFormRawValue | NewTheGRNLineBatchesFormRawValue,
  ): ITheGRNLineBatches | NewTheGRNLineBatches {
    return {
      ...rawTheGRNLineBatches,
      txDate: dayjs(rawTheGRNLineBatches.txDate, DATE_TIME_FORMAT),
      manufactureDate: dayjs(rawTheGRNLineBatches.manufactureDate, DATE_TIME_FORMAT),
      expiredDate: dayjs(rawTheGRNLineBatches.expiredDate, DATE_TIME_FORMAT),
      lmd: dayjs(rawTheGRNLineBatches.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertTheGRNLineBatchesToTheGRNLineBatchesRawValue(
    theGRNLineBatches: ITheGRNLineBatches | (Partial<NewTheGRNLineBatches> & TheGRNLineBatchesFormDefaults),
  ): TheGRNLineBatchesFormRawValue | PartialWithRequiredKeyOf<NewTheGRNLineBatchesFormRawValue> {
    return {
      ...theGRNLineBatches,
      txDate: theGRNLineBatches.txDate ? theGRNLineBatches.txDate.format(DATE_TIME_FORMAT) : undefined,
      manufactureDate: theGRNLineBatches.manufactureDate ? theGRNLineBatches.manufactureDate.format(DATE_TIME_FORMAT) : undefined,
      expiredDate: theGRNLineBatches.expiredDate ? theGRNLineBatches.expiredDate.format(DATE_TIME_FORMAT) : undefined,
      lmd: theGRNLineBatches.lmd ? theGRNLineBatches.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
