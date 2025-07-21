import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGRN } from '../grn.model';
import { GRNService } from '../service/grn.service';

@Component({
  templateUrl: './grn-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GRNDeleteDialogComponent {
  gRN?: IGRN;

  protected gRNService = inject(GRNService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gRNService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
