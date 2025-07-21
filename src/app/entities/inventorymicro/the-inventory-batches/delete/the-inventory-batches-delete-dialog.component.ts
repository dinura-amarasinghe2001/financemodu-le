import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITheInventoryBatches } from '../the-inventory-batches.model';
import { TheInventoryBatchesService } from '../service/the-inventory-batches.service';

@Component({
  templateUrl: './the-inventory-batches-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TheInventoryBatchesDeleteDialogComponent {
  theInventoryBatches?: ITheInventoryBatches;

  protected theInventoryBatchesService = inject(TheInventoryBatchesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.theInventoryBatchesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
