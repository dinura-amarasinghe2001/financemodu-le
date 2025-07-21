import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJobEstimate } from '../job-estimate.model';
import { JobEstimateService } from '../service/job-estimate.service';

@Component({
  templateUrl: './job-estimate-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JobEstimateDeleteDialogComponent {
  jobEstimate?: IJobEstimate;

  protected jobEstimateService = inject(JobEstimateService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobEstimateService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
