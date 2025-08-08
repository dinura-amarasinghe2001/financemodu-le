import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITransaction, NewTransaction } from '../transaction.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITransaction for edit and NewTransactionFormGroupInput for create.
 */
type TransactionFormGroupInput = ITransaction | PartialWithRequiredKeyOf<NewTransaction>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITransaction | NewTransaction> = Omit<T, 'date' | 'lmd'> & {
  date?: string | null;
  lmd?: string | null;
};

type TransactionFormRawValue = FormValueOf<ITransaction>;

type NewTransactionFormRawValue = FormValueOf<NewTransaction>;

type TransactionFormDefaults = Pick<NewTransaction, 'id' | 'date' | 'lmd'>;

type TransactionFormGroupContent = {
  id: FormControl<TransactionFormRawValue['id'] | NewTransaction['id']>;
  opsUnitID: FormControl<TransactionFormRawValue['opsUnitID']>;
  accountId: FormControl<TransactionFormRawValue['accountId']>;
  accountCode: FormControl<TransactionFormRawValue['accountCode']>;
  debit: FormControl<TransactionFormRawValue['debit']>;
  credit: FormControl<TransactionFormRawValue['credit']>;
  date: FormControl<TransactionFormRawValue['date']>;
  refDoc: FormControl<TransactionFormRawValue['refDoc']>;
  relid: FormControl<TransactionFormRawValue['relid']>;
  subId: FormControl<TransactionFormRawValue['subId']>;
  source: FormControl<TransactionFormRawValue['source']>;
  lmu: FormControl<TransactionFormRawValue['lmu']>;
  lmd: FormControl<TransactionFormRawValue['lmd']>;
};

export type TransactionFormGroup = FormGroup<TransactionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TransactionFormService {
  createTransactionFormGroup(transaction: TransactionFormGroupInput = { id: null }): TransactionFormGroup {
    const transactionRawValue = this.convertTransactionToTransactionRawValue({
      ...this.getFormDefaults(),
      ...transaction,
    });
    return new FormGroup<TransactionFormGroupContent>({
      id: new FormControl(
        { value: transactionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      opsUnitID: new FormControl(transactionRawValue.opsUnitID),
      accountId: new FormControl(transactionRawValue.accountId),
      accountCode: new FormControl(transactionRawValue.accountCode),
      debit: new FormControl(transactionRawValue.debit),
      credit: new FormControl(transactionRawValue.credit),
      date: new FormControl(transactionRawValue.date),
      refDoc: new FormControl(transactionRawValue.refDoc),
      relid: new FormControl(transactionRawValue.relid),
      subId: new FormControl(transactionRawValue.subId),
      source: new FormControl(transactionRawValue.source),
      lmu: new FormControl(transactionRawValue.lmu),
      lmd: new FormControl(transactionRawValue.lmd),
    });
  }

  getTransaction(form: TransactionFormGroup): ITransaction | NewTransaction {
    return this.convertTransactionRawValueToTransaction(form.getRawValue() as TransactionFormRawValue | NewTransactionFormRawValue);
  }

  resetForm(form: TransactionFormGroup, transaction: TransactionFormGroupInput): void {
    const transactionRawValue = this.convertTransactionToTransactionRawValue({ ...this.getFormDefaults(), ...transaction });
    form.reset(
      {
        ...transactionRawValue,
        id: { value: transactionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TransactionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      lmd: currentTime,
    };
  }

  private convertTransactionRawValueToTransaction(
    rawTransaction: TransactionFormRawValue | NewTransactionFormRawValue,
  ): ITransaction | NewTransaction {
    return {
      ...rawTransaction,
      date: dayjs(rawTransaction.date, DATE_TIME_FORMAT),
      lmd: dayjs(rawTransaction.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertTransactionToTransactionRawValue(
    transaction: ITransaction | (Partial<NewTransaction> & TransactionFormDefaults),
  ): TransactionFormRawValue | PartialWithRequiredKeyOf<NewTransactionFormRawValue> {
    return {
      ...transaction,
      date: transaction.date ? transaction.date.format(DATE_TIME_FORMAT) : undefined,
      lmd: transaction.lmd ? transaction.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
