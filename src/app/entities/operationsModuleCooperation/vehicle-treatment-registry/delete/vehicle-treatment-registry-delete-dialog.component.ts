import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVehicleTreatmentRegistry } from '../vehicle-treatment-registry.model';
import { VehicleTreatmentRegistryService } from '../service/vehicle-treatment-registry.service';

@Component({
  templateUrl: './vehicle-treatment-registry-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VehicleTreatmentRegistryDeleteDialogComponent {
  vehicleTreatmentRegistry?: IVehicleTreatmentRegistry;

  protected vehicleTreatmentRegistryService = inject(VehicleTreatmentRegistryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehicleTreatmentRegistryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
