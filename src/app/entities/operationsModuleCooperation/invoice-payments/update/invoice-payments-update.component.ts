import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInvoice } from 'app/entities/operationsModule/invoice/invoice.model';
import { InvoiceService } from 'app/entities/operationsModule/invoice/service/invoice.service';
import { IInvoicePayments } from '../invoice-payments.model';
import { InvoicePaymentsService } from '../service/invoice-payments.service';
import { InvoicePaymentsFormGroup, InvoicePaymentsFormService } from './invoice-payments-form.service';

@Component({
  selector: 'jhi-invoice-payments-update',
  templateUrl: './invoice-payments-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InvoicePaymentsUpdateComponent implements OnInit {
  isSaving = false;
  invoicePayments: IInvoicePayments | null = null;

  invoicesSharedCollection: IInvoice[] = [];

  protected invoicePaymentsService = inject(InvoicePaymentsService);
  protected invoicePaymentsFormService = inject(InvoicePaymentsFormService);
  protected invoiceService = inject(InvoiceService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: InvoicePaymentsFormGroup = this.invoicePaymentsFormService.createInvoicePaymentsFormGroup();

  compareInvoice = (o1: IInvoice | null, o2: IInvoice | null): boolean => this.invoiceService.compareInvoice(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoicePayments }) => {
      this.invoicePayments = invoicePayments;
      if (invoicePayments) {
        this.updateForm(invoicePayments);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoicePayments = this.invoicePaymentsFormService.getInvoicePayments(this.editForm);
    if (invoicePayments.id !== null) {
      this.subscribeToSaveResponse(this.invoicePaymentsService.update(invoicePayments));
    } else {
      this.subscribeToSaveResponse(this.invoicePaymentsService.create(invoicePayments));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoicePayments>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(invoicePayments: IInvoicePayments): void {
    this.invoicePayments = invoicePayments;
    this.invoicePaymentsFormService.resetForm(this.editForm, invoicePayments);

    this.invoicesSharedCollection = this.invoiceService.addInvoiceToCollectionIfMissing<IInvoice>(
      this.invoicesSharedCollection,
      invoicePayments.invoice,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.invoiceService
      .query()
      .pipe(map((res: HttpResponse<IInvoice[]>) => res.body ?? []))
      .pipe(
        map((invoices: IInvoice[]) =>
          this.invoiceService.addInvoiceToCollectionIfMissing<IInvoice>(invoices, this.invoicePayments?.invoice),
        ),
      )
      .subscribe((invoices: IInvoice[]) => (this.invoicesSharedCollection = invoices));
  }
}
