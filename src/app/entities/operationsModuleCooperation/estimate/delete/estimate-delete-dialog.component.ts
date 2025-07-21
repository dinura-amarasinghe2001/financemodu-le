import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEstimate } from '../estimate.model';
import { EstimateService } from '../service/estimate.service';

@Component({
  templateUrl: './estimate-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EstimateDeleteDialogComponent {
  estimate?: IEstimate;

  protected estimateService = inject(EstimateService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estimateService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
