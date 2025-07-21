import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInvoiceItem, NewInvoiceItem } from '../invoice-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoiceItem for edit and NewInvoiceItemFormGroupInput for create.
 */
type InvoiceItemFormGroupInput = IInvoiceItem | PartialWithRequiredKeyOf<NewInvoiceItem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInvoiceItem | NewInvoiceItem> = Omit<T, 'invoiceDate'> & {
  invoiceDate?: string | null;
};

type InvoiceItemFormRawValue = FormValueOf<IInvoiceItem>;

type NewInvoiceItemFormRawValue = FormValueOf<NewInvoiceItem>;

type InvoiceItemFormDefaults = Pick<NewInvoiceItem, 'id' | 'invoiceDate'>;

type InvoiceItemFormGroupContent = {
  id: FormControl<InvoiceItemFormRawValue['id'] | NewInvoiceItem['id']>;
  invoiceDate: FormControl<InvoiceItemFormRawValue['invoiceDate']>;
  descriptions: FormControl<InvoiceItemFormRawValue['descriptions']>;
  amount: FormControl<InvoiceItemFormRawValue['amount']>;
  types: FormControl<InvoiceItemFormRawValue['types']>;
  invoice: FormControl<InvoiceItemFormRawValue['invoice']>;
};

export type InvoiceItemFormGroup = FormGroup<InvoiceItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoiceItemFormService {
  createInvoiceItemFormGroup(invoiceItem: InvoiceItemFormGroupInput = { id: null }): InvoiceItemFormGroup {
    const invoiceItemRawValue = this.convertInvoiceItemToInvoiceItemRawValue({
      ...this.getFormDefaults(),
      ...invoiceItem,
    });
    return new FormGroup<InvoiceItemFormGroupContent>({
      id: new FormControl(
        { value: invoiceItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      invoiceDate: new FormControl(invoiceItemRawValue.invoiceDate),
      descriptions: new FormControl(invoiceItemRawValue.descriptions),
      amount: new FormControl(invoiceItemRawValue.amount),
      types: new FormControl(invoiceItemRawValue.types),
      invoice: new FormControl(invoiceItemRawValue.invoice),
    });
  }

  getInvoiceItem(form: InvoiceItemFormGroup): IInvoiceItem | NewInvoiceItem {
    return this.convertInvoiceItemRawValueToInvoiceItem(form.getRawValue() as InvoiceItemFormRawValue | NewInvoiceItemFormRawValue);
  }

  resetForm(form: InvoiceItemFormGroup, invoiceItem: InvoiceItemFormGroupInput): void {
    const invoiceItemRawValue = this.convertInvoiceItemToInvoiceItemRawValue({ ...this.getFormDefaults(), ...invoiceItem });
    form.reset(
      {
        ...invoiceItemRawValue,
        id: { value: invoiceItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InvoiceItemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      invoiceDate: currentTime,
    };
  }

  private convertInvoiceItemRawValueToInvoiceItem(
    rawInvoiceItem: InvoiceItemFormRawValue | NewInvoiceItemFormRawValue,
  ): IInvoiceItem | NewInvoiceItem {
    return {
      ...rawInvoiceItem,
      invoiceDate: dayjs(rawInvoiceItem.invoiceDate, DATE_TIME_FORMAT),
    };
  }

  private convertInvoiceItemToInvoiceItemRawValue(
    invoiceItem: IInvoiceItem | (Partial<NewInvoiceItem> & InvoiceItemFormDefaults),
  ): InvoiceItemFormRawValue | PartialWithRequiredKeyOf<NewInvoiceItemFormRawValue> {
    return {
      ...invoiceItem,
      invoiceDate: invoiceItem.invoiceDate ? invoiceItem.invoiceDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
