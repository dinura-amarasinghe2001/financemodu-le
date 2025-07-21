import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJobEstimateWorkProducts } from '../job-estimate-work-products.model';
import { JobEstimateWorkProductsService } from '../service/job-estimate-work-products.service';

@Component({
  templateUrl: './job-estimate-work-products-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JobEstimateWorkProductsDeleteDialogComponent {
  jobEstimateWorkProducts?: IJobEstimateWorkProducts;

  protected jobEstimateWorkProductsService = inject(JobEstimateWorkProductsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobEstimateWorkProductsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
