import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJobItemTimeEstimation } from '../job-item-time-estimation.model';
import { JobItemTimeEstimationService } from '../service/job-item-time-estimation.service';

@Component({
  templateUrl: './job-item-time-estimation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JobItemTimeEstimationDeleteDialogComponent {
  jobItemTimeEstimation?: IJobItemTimeEstimation;

  protected jobItemTimeEstimationService = inject(JobItemTimeEstimationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobItemTimeEstimationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
