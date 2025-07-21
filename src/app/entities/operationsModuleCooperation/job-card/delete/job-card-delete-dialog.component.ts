import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJobCard } from '../job-card.model';
import { JobCardService } from '../service/job-card.service';

@Component({
  templateUrl: './job-card-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JobCardDeleteDialogComponent {
  jobCard?: IJobCard;

  protected jobCardService = inject(JobCardService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobCardService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
