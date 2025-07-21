import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJobEstimateWorkLog } from '../job-estimate-work-log.model';
import { JobEstimateWorkLogService } from '../service/job-estimate-work-log.service';

@Component({
  templateUrl: './job-estimate-work-log-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JobEstimateWorkLogDeleteDialogComponent {
  jobEstimateWorkLog?: IJobEstimateWorkLog;

  protected jobEstimateWorkLogService = inject(JobEstimateWorkLogService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobEstimateWorkLogService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
