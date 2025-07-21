import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITheGRNLineBatches } from '../the-grn-line-batches.model';
import { TheGRNLineBatchesService } from '../service/the-grn-line-batches.service';

@Component({
  templateUrl: './the-grn-line-batches-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TheGRNLineBatchesDeleteDialogComponent {
  theGRNLineBatches?: ITheGRNLineBatches;

  protected theGRNLineBatchesService = inject(TheGRNLineBatchesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.theGRNLineBatchesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
