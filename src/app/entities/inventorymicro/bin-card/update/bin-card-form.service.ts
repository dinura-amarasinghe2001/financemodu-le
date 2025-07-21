import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBinCard, NewBinCard } from '../bin-card.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBinCard for edit and NewBinCardFormGroupInput for create.
 */
type BinCardFormGroupInput = IBinCard | PartialWithRequiredKeyOf<NewBinCard>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IBinCard | NewBinCard> = Omit<T, 'txDate' | 'lmd' | 'recordDate'> & {
  txDate?: string | null;
  lmd?: string | null;
  recordDate?: string | null;
};

type BinCardFormRawValue = FormValueOf<IBinCard>;

type NewBinCardFormRawValue = FormValueOf<NewBinCard>;

type BinCardFormDefaults = Pick<NewBinCard, 'id' | 'txDate' | 'lmd' | 'recordDate'>;

type BinCardFormGroupContent = {
  id: FormControl<BinCardFormRawValue['id'] | NewBinCard['id']>;
  itemId: FormControl<BinCardFormRawValue['itemId']>;
  itemCode: FormControl<BinCardFormRawValue['itemCode']>;
  reference: FormControl<BinCardFormRawValue['reference']>;
  txDate: FormControl<BinCardFormRawValue['txDate']>;
  qtyIn: FormControl<BinCardFormRawValue['qtyIn']>;
  qtyOut: FormControl<BinCardFormRawValue['qtyOut']>;
  price: FormControl<BinCardFormRawValue['price']>;
  lmu: FormControl<BinCardFormRawValue['lmu']>;
  lmd: FormControl<BinCardFormRawValue['lmd']>;
  referenceCode: FormControl<BinCardFormRawValue['referenceCode']>;
  recordDate: FormControl<BinCardFormRawValue['recordDate']>;
  batchId: FormControl<BinCardFormRawValue['batchId']>;
  locationId: FormControl<BinCardFormRawValue['locationId']>;
  locationCode: FormControl<BinCardFormRawValue['locationCode']>;
  opening: FormControl<BinCardFormRawValue['opening']>;
  description: FormControl<BinCardFormRawValue['description']>;
  referenceDoc: FormControl<BinCardFormRawValue['referenceDoc']>;
};

export type BinCardFormGroup = FormGroup<BinCardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BinCardFormService {
  createBinCardFormGroup(binCard: BinCardFormGroupInput = { id: null }): BinCardFormGroup {
    const binCardRawValue = this.convertBinCardToBinCardRawValue({
      ...this.getFormDefaults(),
      ...binCard,
    });
    return new FormGroup<BinCardFormGroupContent>({
      id: new FormControl(
        { value: binCardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      itemId: new FormControl(binCardRawValue.itemId),
      itemCode: new FormControl(binCardRawValue.itemCode),
      reference: new FormControl(binCardRawValue.reference),
      txDate: new FormControl(binCardRawValue.txDate),
      qtyIn: new FormControl(binCardRawValue.qtyIn),
      qtyOut: new FormControl(binCardRawValue.qtyOut),
      price: new FormControl(binCardRawValue.price),
      lmu: new FormControl(binCardRawValue.lmu),
      lmd: new FormControl(binCardRawValue.lmd),
      referenceCode: new FormControl(binCardRawValue.referenceCode),
      recordDate: new FormControl(binCardRawValue.recordDate),
      batchId: new FormControl(binCardRawValue.batchId),
      locationId: new FormControl(binCardRawValue.locationId),
      locationCode: new FormControl(binCardRawValue.locationCode),
      opening: new FormControl(binCardRawValue.opening),
      description: new FormControl(binCardRawValue.description),
      referenceDoc: new FormControl(binCardRawValue.referenceDoc),
    });
  }

  getBinCard(form: BinCardFormGroup): IBinCard | NewBinCard {
    return this.convertBinCardRawValueToBinCard(form.getRawValue() as BinCardFormRawValue | NewBinCardFormRawValue);
  }

  resetForm(form: BinCardFormGroup, binCard: BinCardFormGroupInput): void {
    const binCardRawValue = this.convertBinCardToBinCardRawValue({ ...this.getFormDefaults(), ...binCard });
    form.reset(
      {
        ...binCardRawValue,
        id: { value: binCardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BinCardFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      txDate: currentTime,
      lmd: currentTime,
      recordDate: currentTime,
    };
  }

  private convertBinCardRawValueToBinCard(rawBinCard: BinCardFormRawValue | NewBinCardFormRawValue): IBinCard | NewBinCard {
    return {
      ...rawBinCard,
      txDate: dayjs(rawBinCard.txDate, DATE_TIME_FORMAT),
      lmd: dayjs(rawBinCard.lmd, DATE_TIME_FORMAT),
      recordDate: dayjs(rawBinCard.recordDate, DATE_TIME_FORMAT),
    };
  }

  private convertBinCardToBinCardRawValue(
    binCard: IBinCard | (Partial<NewBinCard> & BinCardFormDefaults),
  ): BinCardFormRawValue | PartialWithRequiredKeyOf<NewBinCardFormRawValue> {
    return {
      ...binCard,
      txDate: binCard.txDate ? binCard.txDate.format(DATE_TIME_FORMAT) : undefined,
      lmd: binCard.lmd ? binCard.lmd.format(DATE_TIME_FORMAT) : undefined,
      recordDate: binCard.recordDate ? binCard.recordDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
