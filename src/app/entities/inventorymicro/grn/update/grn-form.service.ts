import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGRN, NewGRN } from '../grn.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGRN for edit and NewGRNFormGroupInput for create.
 */
type GRNFormGroupInput = IGRN | PartialWithRequiredKeyOf<NewGRN>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGRN | NewGRN> = Omit<T, 'grnDate' | 'lmd' | 'supplierInvoiceDate'> & {
  grnDate?: string | null;
  lmd?: string | null;
  supplierInvoiceDate?: string | null;
};

type GRNFormRawValue = FormValueOf<IGRN>;

type NewGRNFormRawValue = FormValueOf<NewGRN>;

type GRNFormDefaults = Pick<
  NewGRN,
  'id' | 'grnDate' | 'lmd' | 'isActive' | 'inspected' | 'isAccountSectionChecked' | 'isInventoryUpdated' | 'supplierInvoiceDate'
>;

type GRNFormGroupContent = {
  id: FormControl<GRNFormRawValue['id'] | NewGRN['id']>;
  grnCode: FormControl<GRNFormRawValue['grnCode']>;
  grnDate: FormControl<GRNFormRawValue['grnDate']>;
  poNum: FormControl<GRNFormRawValue['poNum']>;
  supplierId: FormControl<GRNFormRawValue['supplierId']>;
  supplierName: FormControl<GRNFormRawValue['supplierName']>;
  supplierAddress: FormControl<GRNFormRawValue['supplierAddress']>;
  invoiceId: FormControl<GRNFormRawValue['invoiceId']>;
  invoiceCode: FormControl<GRNFormRawValue['invoiceCode']>;
  subTotal: FormControl<GRNFormRawValue['subTotal']>;
  lmu: FormControl<GRNFormRawValue['lmu']>;
  lmd: FormControl<GRNFormRawValue['lmd']>;
  amountOwing: FormControl<GRNFormRawValue['amountOwing']>;
  isActive: FormControl<GRNFormRawValue['isActive']>;
  inspected: FormControl<GRNFormRawValue['inspected']>;
  orderId: FormControl<GRNFormRawValue['orderId']>;
  supplierInvoiceCode: FormControl<GRNFormRawValue['supplierInvoiceCode']>;
  isAccountSectionChecked: FormControl<GRNFormRawValue['isAccountSectionChecked']>;
  total: FormControl<GRNFormRawValue['total']>;
  isInventoryUpdated: FormControl<GRNFormRawValue['isInventoryUpdated']>;
  comments: FormControl<GRNFormRawValue['comments']>;
  supplierInvoiceDate: FormControl<GRNFormRawValue['supplierInvoiceDate']>;
  supplierDiscount: FormControl<GRNFormRawValue['supplierDiscount']>;
};

export type GRNFormGroup = FormGroup<GRNFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GRNFormService {
  createGRNFormGroup(gRN: GRNFormGroupInput = { id: null }): GRNFormGroup {
    const gRNRawValue = this.convertGRNToGRNRawValue({
      ...this.getFormDefaults(),
      ...gRN,
    });
    return new FormGroup<GRNFormGroupContent>({
      id: new FormControl(
        { value: gRNRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      grnCode: new FormControl(gRNRawValue.grnCode),
      grnDate: new FormControl(gRNRawValue.grnDate),
      poNum: new FormControl(gRNRawValue.poNum),
      supplierId: new FormControl(gRNRawValue.supplierId),
      supplierName: new FormControl(gRNRawValue.supplierName),
      supplierAddress: new FormControl(gRNRawValue.supplierAddress),
      invoiceId: new FormControl(gRNRawValue.invoiceId),
      invoiceCode: new FormControl(gRNRawValue.invoiceCode),
      subTotal: new FormControl(gRNRawValue.subTotal),
      lmu: new FormControl(gRNRawValue.lmu),
      lmd: new FormControl(gRNRawValue.lmd),
      amountOwing: new FormControl(gRNRawValue.amountOwing),
      isActive: new FormControl(gRNRawValue.isActive),
      inspected: new FormControl(gRNRawValue.inspected),
      orderId: new FormControl(gRNRawValue.orderId),
      supplierInvoiceCode: new FormControl(gRNRawValue.supplierInvoiceCode),
      isAccountSectionChecked: new FormControl(gRNRawValue.isAccountSectionChecked),
      total: new FormControl(gRNRawValue.total),
      isInventoryUpdated: new FormControl(gRNRawValue.isInventoryUpdated),
      comments: new FormControl(gRNRawValue.comments),
      supplierInvoiceDate: new FormControl(gRNRawValue.supplierInvoiceDate),
      supplierDiscount: new FormControl(gRNRawValue.supplierDiscount),
    });
  }

  getGRN(form: GRNFormGroup): IGRN | NewGRN {
    return this.convertGRNRawValueToGRN(form.getRawValue() as GRNFormRawValue | NewGRNFormRawValue);
  }

  resetForm(form: GRNFormGroup, gRN: GRNFormGroupInput): void {
    const gRNRawValue = this.convertGRNToGRNRawValue({ ...this.getFormDefaults(), ...gRN });
    form.reset(
      {
        ...gRNRawValue,
        id: { value: gRNRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GRNFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      grnDate: currentTime,
      lmd: currentTime,
      isActive: false,
      inspected: false,
      isAccountSectionChecked: false,
      isInventoryUpdated: false,
      supplierInvoiceDate: currentTime,
    };
  }

  private convertGRNRawValueToGRN(rawGRN: GRNFormRawValue | NewGRNFormRawValue): IGRN | NewGRN {
    return {
      ...rawGRN,
      grnDate: dayjs(rawGRN.grnDate, DATE_TIME_FORMAT),
      lmd: dayjs(rawGRN.lmd, DATE_TIME_FORMAT),
      supplierInvoiceDate: dayjs(rawGRN.supplierInvoiceDate, DATE_TIME_FORMAT),
    };
  }

  private convertGRNToGRNRawValue(
    gRN: IGRN | (Partial<NewGRN> & GRNFormDefaults),
  ): GRNFormRawValue | PartialWithRequiredKeyOf<NewGRNFormRawValue> {
    return {
      ...gRN,
      grnDate: gRN.grnDate ? gRN.grnDate.format(DATE_TIME_FORMAT) : undefined,
      lmd: gRN.lmd ? gRN.lmd.format(DATE_TIME_FORMAT) : undefined,
      supplierInvoiceDate: gRN.supplierInvoiceDate ? gRN.supplierInvoiceDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
