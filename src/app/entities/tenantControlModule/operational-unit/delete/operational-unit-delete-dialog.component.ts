import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOperationalUnit } from '../operational-unit.model';
import { OperationalUnitService } from '../service/operational-unit.service';

@Component({
  templateUrl: './operational-unit-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OperationalUnitDeleteDialogComponent {
  operationalUnit?: IOperationalUnit;

  protected operationalUnitService = inject(OperationalUnitService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.operationalUnitService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
