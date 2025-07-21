import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IInvoicePayments } from '../invoice-payments.model';

@Component({
  selector: 'jhi-invoice-payments-detail',
  templateUrl: './invoice-payments-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class InvoicePaymentsDetailComponent {
  invoicePayments = input<IInvoicePayments | null>(null);

  previousState(): void {
    window.history.back();
  }
}
