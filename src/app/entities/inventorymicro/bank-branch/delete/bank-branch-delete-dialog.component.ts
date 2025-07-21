import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBankBranch } from '../bank-branch.model';
import { BankBranchService } from '../service/bank-branch.service';

@Component({
  templateUrl: './bank-branch-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BankBranchDeleteDialogComponent {
  bankBranch?: IBankBranch;

  protected bankBranchService = inject(BankBranchService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bankBranchService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
