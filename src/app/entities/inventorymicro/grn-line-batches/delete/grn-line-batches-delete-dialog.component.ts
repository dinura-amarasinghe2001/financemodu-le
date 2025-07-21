import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGRNLineBatches } from '../grn-line-batches.model';
import { GRNLineBatchesService } from '../service/grn-line-batches.service';

@Component({
  templateUrl: './grn-line-batches-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GRNLineBatchesDeleteDialogComponent {
  gRNLineBatches?: IGRNLineBatches;

  protected gRNLineBatchesService = inject(GRNLineBatchesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gRNLineBatchesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
