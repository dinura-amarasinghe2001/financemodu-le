import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPreEstimate } from '../pre-estimate.model';
import { PreEstimateService } from '../service/pre-estimate.service';

@Component({
  templateUrl: './pre-estimate-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PreEstimateDeleteDialogComponent {
  preEstimate?: IPreEstimate;

  protected preEstimateService = inject(PreEstimateService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.preEstimateService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
