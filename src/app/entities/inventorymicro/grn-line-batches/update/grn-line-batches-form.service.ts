import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGRNLineBatches, NewGRNLineBatches } from '../grn-line-batches.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGRNLineBatches for edit and NewGRNLineBatchesFormGroupInput for create.
 */
type GRNLineBatchesFormGroupInput = IGRNLineBatches | PartialWithRequiredKeyOf<NewGRNLineBatches>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGRNLineBatches | NewGRNLineBatches> = Omit<T, 'txDate' | 'manufactureDate' | 'expiredDate' | 'lmd'> & {
  txDate?: string | null;
  manufactureDate?: string | null;
  expiredDate?: string | null;
  lmd?: string | null;
};

type GRNLineBatchesFormRawValue = FormValueOf<IGRNLineBatches>;

type NewGRNLineBatchesFormRawValue = FormValueOf<NewGRNLineBatches>;

type GRNLineBatchesFormDefaults = Pick<
  NewGRNLineBatches,
  'id' | 'txDate' | 'manufactureDate' | 'expiredDate' | 'hasVat' | 'lmd' | 'inspected' | 'isInventoryUpdate'
>;

type GRNLineBatchesFormGroupContent = {
  id: FormControl<GRNLineBatchesFormRawValue['id'] | NewGRNLineBatches['id']>;
  lineId: FormControl<GRNLineBatchesFormRawValue['lineId']>;
  batchLineId: FormControl<GRNLineBatchesFormRawValue['batchLineId']>;
  itemId: FormControl<GRNLineBatchesFormRawValue['itemId']>;
  code: FormControl<GRNLineBatchesFormRawValue['code']>;
  txDate: FormControl<GRNLineBatchesFormRawValue['txDate']>;
  manufactureDate: FormControl<GRNLineBatchesFormRawValue['manufactureDate']>;
  expiredDate: FormControl<GRNLineBatchesFormRawValue['expiredDate']>;
  qty: FormControl<GRNLineBatchesFormRawValue['qty']>;
  cost: FormControl<GRNLineBatchesFormRawValue['cost']>;
  price: FormControl<GRNLineBatchesFormRawValue['price']>;
  costWithoutVat: FormControl<GRNLineBatchesFormRawValue['costWithoutVat']>;
  priceWithoutVat: FormControl<GRNLineBatchesFormRawValue['priceWithoutVat']>;
  hasVat: FormControl<GRNLineBatchesFormRawValue['hasVat']>;
  supplierDiscount: FormControl<GRNLineBatchesFormRawValue['supplierDiscount']>;
  notes: FormControl<GRNLineBatchesFormRawValue['notes']>;
  lmu: FormControl<GRNLineBatchesFormRawValue['lmu']>;
  lmd: FormControl<GRNLineBatchesFormRawValue['lmd']>;
  batchId: FormControl<GRNLineBatchesFormRawValue['batchId']>;
  qtyIn: FormControl<GRNLineBatchesFormRawValue['qtyIn']>;
  qtyOut: FormControl<GRNLineBatchesFormRawValue['qtyOut']>;
  batchLineTotal: FormControl<GRNLineBatchesFormRawValue['batchLineTotal']>;
  inspected: FormControl<GRNLineBatchesFormRawValue['inspected']>;
  passQty: FormControl<GRNLineBatchesFormRawValue['passQty']>;
  currentReceivedQty: FormControl<GRNLineBatchesFormRawValue['currentReceivedQty']>;
  totalPassedQty: FormControl<GRNLineBatchesFormRawValue['totalPassedQty']>;
  isInventoryUpdate: FormControl<GRNLineBatchesFormRawValue['isInventoryUpdate']>;
  inventoryQty: FormControl<GRNLineBatchesFormRawValue['inventoryQty']>;
  totalInventoryQty: FormControl<GRNLineBatchesFormRawValue['totalInventoryQty']>;
  returnPrice: FormControl<GRNLineBatchesFormRawValue['returnPrice']>;
};

export type GRNLineBatchesFormGroup = FormGroup<GRNLineBatchesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GRNLineBatchesFormService {
  createGRNLineBatchesFormGroup(gRNLineBatches: GRNLineBatchesFormGroupInput = { id: null }): GRNLineBatchesFormGroup {
    const gRNLineBatchesRawValue = this.convertGRNLineBatchesToGRNLineBatchesRawValue({
      ...this.getFormDefaults(),
      ...gRNLineBatches,
    });
    return new FormGroup<GRNLineBatchesFormGroupContent>({
      id: new FormControl(
        { value: gRNLineBatchesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      lineId: new FormControl(gRNLineBatchesRawValue.lineId),
      batchLineId: new FormControl(gRNLineBatchesRawValue.batchLineId),
      itemId: new FormControl(gRNLineBatchesRawValue.itemId),
      code: new FormControl(gRNLineBatchesRawValue.code),
      txDate: new FormControl(gRNLineBatchesRawValue.txDate),
      manufactureDate: new FormControl(gRNLineBatchesRawValue.manufactureDate),
      expiredDate: new FormControl(gRNLineBatchesRawValue.expiredDate),
      qty: new FormControl(gRNLineBatchesRawValue.qty),
      cost: new FormControl(gRNLineBatchesRawValue.cost),
      price: new FormControl(gRNLineBatchesRawValue.price),
      costWithoutVat: new FormControl(gRNLineBatchesRawValue.costWithoutVat),
      priceWithoutVat: new FormControl(gRNLineBatchesRawValue.priceWithoutVat),
      hasVat: new FormControl(gRNLineBatchesRawValue.hasVat),
      supplierDiscount: new FormControl(gRNLineBatchesRawValue.supplierDiscount),
      notes: new FormControl(gRNLineBatchesRawValue.notes),
      lmu: new FormControl(gRNLineBatchesRawValue.lmu),
      lmd: new FormControl(gRNLineBatchesRawValue.lmd),
      batchId: new FormControl(gRNLineBatchesRawValue.batchId),
      qtyIn: new FormControl(gRNLineBatchesRawValue.qtyIn),
      qtyOut: new FormControl(gRNLineBatchesRawValue.qtyOut),
      batchLineTotal: new FormControl(gRNLineBatchesRawValue.batchLineTotal),
      inspected: new FormControl(gRNLineBatchesRawValue.inspected),
      passQty: new FormControl(gRNLineBatchesRawValue.passQty),
      currentReceivedQty: new FormControl(gRNLineBatchesRawValue.currentReceivedQty),
      totalPassedQty: new FormControl(gRNLineBatchesRawValue.totalPassedQty),
      isInventoryUpdate: new FormControl(gRNLineBatchesRawValue.isInventoryUpdate),
      inventoryQty: new FormControl(gRNLineBatchesRawValue.inventoryQty),
      totalInventoryQty: new FormControl(gRNLineBatchesRawValue.totalInventoryQty),
      returnPrice: new FormControl(gRNLineBatchesRawValue.returnPrice),
    });
  }

  getGRNLineBatches(form: GRNLineBatchesFormGroup): IGRNLineBatches | NewGRNLineBatches {
    return this.convertGRNLineBatchesRawValueToGRNLineBatches(
      form.getRawValue() as GRNLineBatchesFormRawValue | NewGRNLineBatchesFormRawValue,
    );
  }

  resetForm(form: GRNLineBatchesFormGroup, gRNLineBatches: GRNLineBatchesFormGroupInput): void {
    const gRNLineBatchesRawValue = this.convertGRNLineBatchesToGRNLineBatchesRawValue({ ...this.getFormDefaults(), ...gRNLineBatches });
    form.reset(
      {
        ...gRNLineBatchesRawValue,
        id: { value: gRNLineBatchesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GRNLineBatchesFormDefaults {
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

  private convertGRNLineBatchesRawValueToGRNLineBatches(
    rawGRNLineBatches: GRNLineBatchesFormRawValue | NewGRNLineBatchesFormRawValue,
  ): IGRNLineBatches | NewGRNLineBatches {
    return {
      ...rawGRNLineBatches,
      txDate: dayjs(rawGRNLineBatches.txDate, DATE_TIME_FORMAT),
      manufactureDate: dayjs(rawGRNLineBatches.manufactureDate, DATE_TIME_FORMAT),
      expiredDate: dayjs(rawGRNLineBatches.expiredDate, DATE_TIME_FORMAT),
      lmd: dayjs(rawGRNLineBatches.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertGRNLineBatchesToGRNLineBatchesRawValue(
    gRNLineBatches: IGRNLineBatches | (Partial<NewGRNLineBatches> & GRNLineBatchesFormDefaults),
  ): GRNLineBatchesFormRawValue | PartialWithRequiredKeyOf<NewGRNLineBatchesFormRawValue> {
    return {
      ...gRNLineBatches,
      txDate: gRNLineBatches.txDate ? gRNLineBatches.txDate.format(DATE_TIME_FORMAT) : undefined,
      manufactureDate: gRNLineBatches.manufactureDate ? gRNLineBatches.manufactureDate.format(DATE_TIME_FORMAT) : undefined,
      expiredDate: gRNLineBatches.expiredDate ? gRNLineBatches.expiredDate.format(DATE_TIME_FORMAT) : undefined,
      lmd: gRNLineBatches.lmd ? gRNLineBatches.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
