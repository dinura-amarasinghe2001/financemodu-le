import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInvoicePayments } from '../invoice-payments.model';
import { InvoicePaymentsService } from '../service/invoice-payments.service';

@Component({
  templateUrl: './invoice-payments-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InvoicePaymentsDeleteDialogComponent {
  invoicePayments?: IInvoicePayments;

  protected invoicePaymentsService = inject(InvoicePaymentsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.invoicePaymentsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
