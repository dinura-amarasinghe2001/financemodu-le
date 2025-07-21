import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISupplierBankAccounts } from '../supplier-bank-accounts.model';
import { SupplierBankAccountsService } from '../service/supplier-bank-accounts.service';

@Component({
  templateUrl: './supplier-bank-accounts-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SupplierBankAccountsDeleteDialogComponent {
  supplierBankAccounts?: ISupplierBankAccounts;

  protected supplierBankAccountsService = inject(SupplierBankAccountsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.supplierBankAccountsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
