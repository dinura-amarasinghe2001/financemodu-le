import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInvoicePayments, NewInvoicePayments } from '../invoice-payments.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoicePayments for edit and NewInvoicePaymentsFormGroupInput for create.
 */
type InvoicePaymentsFormGroupInput = IInvoicePayments | PartialWithRequiredKeyOf<NewInvoicePayments>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInvoicePayments | NewInvoicePayments> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type InvoicePaymentsFormRawValue = FormValueOf<IInvoicePayments>;

type NewInvoicePaymentsFormRawValue = FormValueOf<NewInvoicePayments>;

type InvoicePaymentsFormDefaults = Pick<NewInvoicePayments, 'id' | 'createdDate' | 'lastModifiedDate'>;

type InvoicePaymentsFormGroupContent = {
  id: FormControl<InvoicePaymentsFormRawValue['id'] | NewInvoicePayments['id']>;
  paymentType: FormControl<InvoicePaymentsFormRawValue['paymentType']>;
  amount: FormControl<InvoicePaymentsFormRawValue['amount']>;
  createdBy: FormControl<InvoicePaymentsFormRawValue['createdBy']>;
  createdDate: FormControl<InvoicePaymentsFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<InvoicePaymentsFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<InvoicePaymentsFormRawValue['lastModifiedDate']>;
  invoice: FormControl<InvoicePaymentsFormRawValue['invoice']>;
};

export type InvoicePaymentsFormGroup = FormGroup<InvoicePaymentsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoicePaymentsFormService {
  createInvoicePaymentsFormGroup(invoicePayments: InvoicePaymentsFormGroupInput = { id: null }): InvoicePaymentsFormGroup {
    const invoicePaymentsRawValue = this.convertInvoicePaymentsToInvoicePaymentsRawValue({
      ...this.getFormDefaults(),
      ...invoicePayments,
    });
    return new FormGroup<InvoicePaymentsFormGroupContent>({
      id: new FormControl(
        { value: invoicePaymentsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      paymentType: new FormControl(invoicePaymentsRawValue.paymentType),
      amount: new FormControl(invoicePaymentsRawValue.amount),
      createdBy: new FormControl(invoicePaymentsRawValue.createdBy),
      createdDate: new FormControl(invoicePaymentsRawValue.createdDate),
      lastModifiedBy: new FormControl(invoicePaymentsRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(invoicePaymentsRawValue.lastModifiedDate),
      invoice: new FormControl(invoicePaymentsRawValue.invoice),
    });
  }

  getInvoicePayments(form: InvoicePaymentsFormGroup): IInvoicePayments | NewInvoicePayments {
    return this.convertInvoicePaymentsRawValueToInvoicePayments(
      form.getRawValue() as InvoicePaymentsFormRawValue | NewInvoicePaymentsFormRawValue,
    );
  }

  resetForm(form: InvoicePaymentsFormGroup, invoicePayments: InvoicePaymentsFormGroupInput): void {
    const invoicePaymentsRawValue = this.convertInvoicePaymentsToInvoicePaymentsRawValue({ ...this.getFormDefaults(), ...invoicePayments });
    form.reset(
      {
        ...invoicePaymentsRawValue,
        id: { value: invoicePaymentsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InvoicePaymentsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertInvoicePaymentsRawValueToInvoicePayments(
    rawInvoicePayments: InvoicePaymentsFormRawValue | NewInvoicePaymentsFormRawValue,
  ): IInvoicePayments | NewInvoicePayments {
    return {
      ...rawInvoicePayments,
      createdDate: dayjs(rawInvoicePayments.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawInvoicePayments.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertInvoicePaymentsToInvoicePaymentsRawValue(
    invoicePayments: IInvoicePayments | (Partial<NewInvoicePayments> & InvoicePaymentsFormDefaults),
  ): InvoicePaymentsFormRawValue | PartialWithRequiredKeyOf<NewInvoicePaymentsFormRawValue> {
    return {
      ...invoicePayments,
      createdDate: invoicePayments.createdDate ? invoicePayments.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: invoicePayments.lastModifiedDate ? invoicePayments.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
