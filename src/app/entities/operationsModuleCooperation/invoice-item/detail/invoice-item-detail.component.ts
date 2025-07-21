import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IInvoiceItem } from '../invoice-item.model';

@Component({
  selector: 'jhi-invoice-item-detail',
  templateUrl: './invoice-item-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class InvoiceItemDetailComponent {
  invoiceItem = input<IInvoiceItem | null>(null);

  previousState(): void {
    window.history.back();
  }
}
