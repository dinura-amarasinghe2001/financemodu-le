import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGatePass } from '../gate-pass.model';
import { GatePassService } from '../service/gate-pass.service';

@Component({
  templateUrl: './gate-pass-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GatePassDeleteDialogComponent {
  gatePass?: IGatePass;

  protected gatePassService = inject(GatePassService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gatePassService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
