import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAccountType } from '../account-type.model';
import { AccountTypeService } from '../service/account-type.service';

@Component({
  templateUrl: './account-type-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AccountTypeDeleteDialogComponent {
  accountType?: IAccountType;

  protected accountTypeService = inject(AccountTypeService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
