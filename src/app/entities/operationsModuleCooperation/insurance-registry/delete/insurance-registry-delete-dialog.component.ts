import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInsuranceRegistry } from '../insurance-registry.model';
import { InsuranceRegistryService } from '../service/insurance-registry.service';

@Component({
  templateUrl: './insurance-registry-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InsuranceRegistryDeleteDialogComponent {
  insuranceRegistry?: IInsuranceRegistry;

  protected insuranceRegistryService = inject(InsuranceRegistryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.insuranceRegistryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
