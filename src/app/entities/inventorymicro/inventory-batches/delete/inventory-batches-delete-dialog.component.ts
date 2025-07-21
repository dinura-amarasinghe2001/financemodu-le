import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInventoryBatches } from '../inventory-batches.model';
import { InventoryBatchesService } from '../service/inventory-batches.service';

@Component({
  templateUrl: './inventory-batches-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InventoryBatchesDeleteDialogComponent {
  inventoryBatches?: IInventoryBatches;

  protected inventoryBatchesService = inject(InventoryBatchesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.inventoryBatchesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
