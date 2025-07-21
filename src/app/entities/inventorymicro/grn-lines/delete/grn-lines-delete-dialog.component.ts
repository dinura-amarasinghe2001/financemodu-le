import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGRNLines } from '../grn-lines.model';
import { GRNLinesService } from '../service/grn-lines.service';

@Component({
  templateUrl: './grn-lines-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GRNLinesDeleteDialogComponent {
  gRNLines?: IGRNLines;

  protected gRNLinesService = inject(GRNLinesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gRNLinesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
