import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGRNLines, NewGRNLines } from '../grn-lines.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGRNLines for edit and NewGRNLinesFormGroupInput for create.
 */
type GRNLinesFormGroupInput = IGRNLines | PartialWithRequiredKeyOf<NewGRNLines>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGRNLines | NewGRNLines> = Omit<T, 'lmd'> & {
  lmd?: string | null;
};

type GRNLinesFormRawValue = FormValueOf<IGRNLines>;

type NewGRNLinesFormRawValue = FormValueOf<NewGRNLines>;

type GRNLinesFormDefaults = Pick<NewGRNLines, 'id' | 'lmd' | 'inspected' | 'isInventoryUpdate'>;

type GRNLinesFormGroupContent = {
  id: FormControl<GRNLinesFormRawValue['id'] | NewGRNLines['id']>;
  grnId: FormControl<GRNLinesFormRawValue['grnId']>;
  lineId: FormControl<GRNLinesFormRawValue['lineId']>;
  itemId: FormControl<GRNLinesFormRawValue['itemId']>;
  itemCode: FormControl<GRNLinesFormRawValue['itemCode']>;
  itemName: FormControl<GRNLinesFormRawValue['itemName']>;
  description: FormControl<GRNLinesFormRawValue['description']>;
  unitOfMeasurement: FormControl<GRNLinesFormRawValue['unitOfMeasurement']>;
  quantity: FormControl<GRNLinesFormRawValue['quantity']>;
  receivedQuantity: FormControl<GRNLinesFormRawValue['receivedQuantity']>;
  price: FormControl<GRNLinesFormRawValue['price']>;
  totalAmount: FormControl<GRNLinesFormRawValue['totalAmount']>;
  lineTotal: FormControl<GRNLinesFormRawValue['lineTotal']>;
  lmu: FormControl<GRNLinesFormRawValue['lmu']>;
  lmd: FormControl<GRNLinesFormRawValue['lmd']>;
  inspected: FormControl<GRNLinesFormRawValue['inspected']>;
  passQty: FormControl<GRNLinesFormRawValue['passQty']>;
  currentReceivedQty: FormControl<GRNLinesFormRawValue['currentReceivedQty']>;
  totalPassedQty: FormControl<GRNLinesFormRawValue['totalPassedQty']>;
  isInventoryUpdate: FormControl<GRNLinesFormRawValue['isInventoryUpdate']>;
  inventoryQty: FormControl<GRNLinesFormRawValue['inventoryQty']>;
  totalInventoryQty: FormControl<GRNLinesFormRawValue['totalInventoryQty']>;
};

export type GRNLinesFormGroup = FormGroup<GRNLinesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GRNLinesFormService {
  createGRNLinesFormGroup(gRNLines: GRNLinesFormGroupInput = { id: null }): GRNLinesFormGroup {
    const gRNLinesRawValue = this.convertGRNLinesToGRNLinesRawValue({
      ...this.getFormDefaults(),
      ...gRNLines,
    });
    return new FormGroup<GRNLinesFormGroupContent>({
      id: new FormControl(
        { value: gRNLinesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      grnId: new FormControl(gRNLinesRawValue.grnId),
      lineId: new FormControl(gRNLinesRawValue.lineId),
      itemId: new FormControl(gRNLinesRawValue.itemId),
      itemCode: new FormControl(gRNLinesRawValue.itemCode),
      itemName: new FormControl(gRNLinesRawValue.itemName),
      description: new FormControl(gRNLinesRawValue.description),
      unitOfMeasurement: new FormControl(gRNLinesRawValue.unitOfMeasurement),
      quantity: new FormControl(gRNLinesRawValue.quantity),
      receivedQuantity: new FormControl(gRNLinesRawValue.receivedQuantity),
      price: new FormControl(gRNLinesRawValue.price),
      totalAmount: new FormControl(gRNLinesRawValue.totalAmount),
      lineTotal: new FormControl(gRNLinesRawValue.lineTotal),
      lmu: new FormControl(gRNLinesRawValue.lmu),
      lmd: new FormControl(gRNLinesRawValue.lmd),
      inspected: new FormControl(gRNLinesRawValue.inspected),
      passQty: new FormControl(gRNLinesRawValue.passQty),
      currentReceivedQty: new FormControl(gRNLinesRawValue.currentReceivedQty),
      totalPassedQty: new FormControl(gRNLinesRawValue.totalPassedQty),
      isInventoryUpdate: new FormControl(gRNLinesRawValue.isInventoryUpdate),
      inventoryQty: new FormControl(gRNLinesRawValue.inventoryQty),
      totalInventoryQty: new FormControl(gRNLinesRawValue.totalInventoryQty),
    });
  }

  getGRNLines(form: GRNLinesFormGroup): IGRNLines | NewGRNLines {
    return this.convertGRNLinesRawValueToGRNLines(form.getRawValue() as GRNLinesFormRawValue | NewGRNLinesFormRawValue);
  }

  resetForm(form: GRNLinesFormGroup, gRNLines: GRNLinesFormGroupInput): void {
    const gRNLinesRawValue = this.convertGRNLinesToGRNLinesRawValue({ ...this.getFormDefaults(), ...gRNLines });
    form.reset(
      {
        ...gRNLinesRawValue,
        id: { value: gRNLinesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GRNLinesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lmd: currentTime,
      inspected: false,
      isInventoryUpdate: false,
    };
  }

  private convertGRNLinesRawValueToGRNLines(rawGRNLines: GRNLinesFormRawValue | NewGRNLinesFormRawValue): IGRNLines | NewGRNLines {
    return {
      ...rawGRNLines,
      lmd: dayjs(rawGRNLines.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertGRNLinesToGRNLinesRawValue(
    gRNLines: IGRNLines | (Partial<NewGRNLines> & GRNLinesFormDefaults),
  ): GRNLinesFormRawValue | PartialWithRequiredKeyOf<NewGRNLinesFormRawValue> {
    return {
      ...gRNLines,
      lmd: gRNLines.lmd ? gRNLines.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
