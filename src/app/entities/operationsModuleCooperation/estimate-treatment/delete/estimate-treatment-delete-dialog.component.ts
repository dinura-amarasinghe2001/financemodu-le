import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEstimateTreatment } from '../estimate-treatment.model';
import { EstimateTreatmentService } from '../service/estimate-treatment.service';

@Component({
  templateUrl: './estimate-treatment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EstimateTreatmentDeleteDialogComponent {
  estimateTreatment?: IEstimateTreatment;

  protected estimateTreatmentService = inject(EstimateTreatmentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estimateTreatmentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
