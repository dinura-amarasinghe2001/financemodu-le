import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPreEstimateTreatment } from '../pre-estimate-treatment.model';
import { PreEstimateTreatmentService } from '../service/pre-estimate-treatment.service';

@Component({
  templateUrl: './pre-estimate-treatment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PreEstimateTreatmentDeleteDialogComponent {
  preEstimateTreatment?: IPreEstimateTreatment;

  protected preEstimateTreatmentService = inject(PreEstimateTreatmentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.preEstimateTreatmentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
