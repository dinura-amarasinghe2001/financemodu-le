import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInvoice, NewInvoice } from '../invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoice for edit and NewInvoiceFormGroupInput for create.
 */
type InvoiceFormGroupInput = IInvoice | PartialWithRequiredKeyOf<NewInvoice>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInvoice | NewInvoice> = Omit<T, 'invoiceDate'> & {
  invoiceDate?: string | null;
};

type InvoiceFormRawValue = FormValueOf<IInvoice>;

type NewInvoiceFormRawValue = FormValueOf<NewInvoice>;

type InvoiceFormDefaults = Pick<NewInvoice, 'id' | 'invoiceDate'>;

type InvoiceFormGroupContent = {
  id: FormControl<InvoiceFormRawValue['id'] | NewInvoice['id']>;
  vehicleID: FormControl<InvoiceFormRawValue['vehicleID']>;
  vehicleBrand: FormControl<InvoiceFormRawValue['vehicleBrand']>;
  vehicleModel: FormControl<InvoiceFormRawValue['vehicleModel']>;
  vehicleLicenseNumber: FormControl<InvoiceFormRawValue['vehicleLicenseNumber']>;
  vehicleOwnerID: FormControl<InvoiceFormRawValue['vehicleOwnerID']>;
  vehicleOwnerName: FormControl<InvoiceFormRawValue['vehicleOwnerName']>;
  vehicleOwnerContactNumber1: FormControl<InvoiceFormRawValue['vehicleOwnerContactNumber1']>;
  vehicleOwnerContactNumber2: FormControl<InvoiceFormRawValue['vehicleOwnerContactNumber2']>;
  jobID: FormControl<InvoiceFormRawValue['jobID']>;
  totalNetAmount: FormControl<InvoiceFormRawValue['totalNetAmount']>;
  discountRate: FormControl<InvoiceFormRawValue['discountRate']>;
  discountAmount: FormControl<InvoiceFormRawValue['discountAmount']>;
  totalAmount: FormControl<InvoiceFormRawValue['totalAmount']>;
  netTotalAmount: FormControl<InvoiceFormRawValue['netTotalAmount']>;
  vatAmount: FormControl<InvoiceFormRawValue['vatAmount']>;
  customerVATNumber: FormControl<InvoiceFormRawValue['customerVATNumber']>;
  invoiceDate: FormControl<InvoiceFormRawValue['invoiceDate']>;
  invoiceStatus: FormControl<InvoiceFormRawValue['invoiceStatus']>;
};

export type InvoiceFormGroup = FormGroup<InvoiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoiceFormService {
  createInvoiceFormGroup(invoice: InvoiceFormGroupInput = { id: null }): InvoiceFormGroup {
    const invoiceRawValue = this.convertInvoiceToInvoiceRawValue({
      ...this.getFormDefaults(),
      ...invoice,
    });
    return new FormGroup<InvoiceFormGroupContent>({
      id: new FormControl(
        { value: invoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      vehicleID: new FormControl(invoiceRawValue.vehicleID),
      vehicleBrand: new FormControl(invoiceRawValue.vehicleBrand),
      vehicleModel: new FormControl(invoiceRawValue.vehicleModel),
      vehicleLicenseNumber: new FormControl(invoiceRawValue.vehicleLicenseNumber),
      vehicleOwnerID: new FormControl(invoiceRawValue.vehicleOwnerID),
      vehicleOwnerName: new FormControl(invoiceRawValue.vehicleOwnerName),
      vehicleOwnerContactNumber1: new FormControl(invoiceRawValue.vehicleOwnerContactNumber1),
      vehicleOwnerContactNumber2: new FormControl(invoiceRawValue.vehicleOwnerContactNumber2),
      jobID: new FormControl(invoiceRawValue.jobID),
      totalNetAmount: new FormControl(invoiceRawValue.totalNetAmount),
      discountRate: new FormControl(invoiceRawValue.discountRate),
      discountAmount: new FormControl(invoiceRawValue.discountAmount),
      totalAmount: new FormControl(invoiceRawValue.totalAmount),
      netTotalAmount: new FormControl(invoiceRawValue.netTotalAmount),
      vatAmount: new FormControl(invoiceRawValue.vatAmount),
      customerVATNumber: new FormControl(invoiceRawValue.customerVATNumber),
      invoiceDate: new FormControl(invoiceRawValue.invoiceDate),
      invoiceStatus: new FormControl(invoiceRawValue.invoiceStatus),
    });
  }

  getInvoice(form: InvoiceFormGroup): IInvoice | NewInvoice {
    return this.convertInvoiceRawValueToInvoice(form.getRawValue() as InvoiceFormRawValue | NewInvoiceFormRawValue);
  }

  resetForm(form: InvoiceFormGroup, invoice: InvoiceFormGroupInput): void {
    const invoiceRawValue = this.convertInvoiceToInvoiceRawValue({ ...this.getFormDefaults(), ...invoice });
    form.reset(
      {
        ...invoiceRawValue,
        id: { value: invoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InvoiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      invoiceDate: currentTime,
    };
  }

  private convertInvoiceRawValueToInvoice(rawInvoice: InvoiceFormRawValue | NewInvoiceFormRawValue): IInvoice | NewInvoice {
    return {
      ...rawInvoice,
      invoiceDate: dayjs(rawInvoice.invoiceDate, DATE_TIME_FORMAT),
    };
  }

  private convertInvoiceToInvoiceRawValue(
    invoice: IInvoice | (Partial<NewInvoice> & InvoiceFormDefaults),
  ): InvoiceFormRawValue | PartialWithRequiredKeyOf<NewInvoiceFormRawValue> {
    return {
      ...invoice,
      invoiceDate: invoice.invoiceDate ? invoice.invoiceDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
