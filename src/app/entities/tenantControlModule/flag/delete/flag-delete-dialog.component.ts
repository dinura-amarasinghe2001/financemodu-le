import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFlag } from '../flag.model';
import { FlagService } from '../service/flag.service';

@Component({
  templateUrl: './flag-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FlagDeleteDialogComponent {
  flag?: IFlag;

  protected flagService = inject(FlagService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.flagService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
